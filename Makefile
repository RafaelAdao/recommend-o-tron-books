setup:
	npm install
	cp .env.development .env

fake-server:
	cd fake-server && npm install && npm start

run:
	npm run dev
