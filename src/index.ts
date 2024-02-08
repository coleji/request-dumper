import express, { Request } from 'express';

const app = express();

function dumpRequestStats(req: Request) {
	const { headers } = req;
	console.log("=======================================================")
	console.log("Timestamp: " + new Date())
	console.log("Host: ", req.hostname)
	console.log("Path: ", req.path)
	console.log("Method: ", req.method)
	console.log("----------")
	console.log("HEADERS: ")
	console.log("----------")
	for (var header in headers) {
		console.log(`${header}: ${headers[header]}`)
	}
}

function dumpRequestBody(bufs: Buffer[]) {
	console.log("----------")
	console.log("BODY Bytes: ")
	console.log("----------")
	for (var i=0; i<bufs.length; i++) {
		process.stdout.write(bufs[i].toString('hex'));
	}
	console.log("----------")
	console.log("BODY String")
	console.log("----------")
	for (var i=0; i<bufs.length; i++) {
		process.stdout.write(bufs[i].toString('utf8'));
	}
}

// app.use(express.raw({ type: "*" }));

app.get("*", (req, res) => {
	dumpRequestStats(req)
	res.end()
})

app.post("*", (req, res) => {
	dumpRequestStats(req)

	var buffers = [] as Buffer[];
	var len=0;
	console.log("----------")
	console.log("Collecting Body");
	console.log("----------")

	req.on('data', (data) => {
		console.log("got data! ", data.length)
		buffers.push(data);
		len += data.length;
	});

	req.on("close", () => {
		console.log("Total size: " + len);
		dumpRequestBody(buffers);
		res.end()
	})
})

app.listen(3000, () => console.log('>>>   request-dumper listening on port 3000!  <<<'));