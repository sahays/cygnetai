import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { ReadableStreamDefaultController } from "stream/web";

export async function toReadableStream(
  remoteApiCall: () => Promise<Response>,
  externalParse: (event: any, controller: ReadableStreamDefaultController<any>) => void
) {
  const decoder = new TextDecoder();

  const res = await remoteApiCall();

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        externalParse(event, controller);
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
