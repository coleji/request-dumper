import express, { Request } from 'express';

const app = express();

function dumpRequestStats(req: Request) {
	const { headers } = req;
	console.log("=======================================================")
	console.log("Host: ", req.hostname)
	console.log("Path: ", req.path)
	console.log("----------")
	console.log("HEADERS: ")
	console.log("----------")
	for (var header in headers) {
		console.log(`${header}: ${headers[header]}`)
	}
}

function dumpRequestBody(buf: Buffer) {
	console.log("----------")
	console.log("BODY Bytes: ")
	console.log("----------")
	console.log(buf.toString('hex'))
	console.log("----------")
	console.log("BODY String")
	console.log("----------")
	console.log(buf.toString('utf8'))
}

// app.use(express.raw({ type: "*" }));

app.get("*", (req, res) => {
	dumpRequestStats(req)
	res.end()
})

app.post("*", (req, res) => {
	dumpRequestStats(req)

	var buffer = Buffer.alloc(0);
	console.log("----------")
	console.log("Collecting Body");
	console.log("----------")

	req.on('data', (data) => {
		console.log("got data! ", data.length)
		buffer = Buffer.concat([buffer, data])
		console.log(buffer.length);
	});

	req.on("close", () => {
		dumpRequestBody(buffer);
		res.end()
	})
})

app.listen(3000, () => console.log('>>>   request-dumper listening on port 3000!  <<<'));