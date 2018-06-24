build:
	docker build -t gomtopia/perfi:1.0 .
run:
	docker run -d --network host --name perfi -v $(CURDIR):/app gomtopia/perfi:1.0
stop:
	docker stop perfi; docker rm perfi
