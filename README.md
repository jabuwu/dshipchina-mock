# dshipchina-mock

Mocks the [DShipChina Fulfillment API](https://www.dshipchina.com/api.html). Only routes on the `api1` and `api4` endpoints are supported, there's no plans at this time to support the [Seller and Buyer API](https://www.dshipchina.com/api3.html).

This project is far more than just a basic mock that returns stubs. Endpoints hope to reimplement the API as closely as possible in a way that aids in testing integration with the DShipChina API, including all its quirks and bugs.&ast;

*&ast; And oh boy are there bugs.*

## Running

Requires node/npm.

```
git clone git@github.com:jabuwu/dshipchina-mock.git
cd dshipchina-mock
npm install
npm start
```

Open browser to `http://localhost:3333` for further instructions.

## Checklist

### api1

- [x] createorder
- [x] createproduct
- [x] editproduct
- [x] getallproducts
- [x] getanorder
- [x] getaproduct
- [x] getorders
- [x] getproductflow
- [x] getshiptrack
- [x] markreceived

### api4

- [x] ~~editabckurl~~*
- [x] getbalance
- [x] getbillrecord
- [x] getship1
- [x] getship2
- [x] getshiprate

&ast; seems to be removed from live api

## Todo

- Ensure product flow matches that of dshipchina's live api.
- Add bill records for "recharging" balance.
- Match dshipchina response headers.
- Check proper status code for a few error responses (search for TODO in code).
- Refund if waybill was cancelled?
- Add ability to edit weight and volume in admin panel.
