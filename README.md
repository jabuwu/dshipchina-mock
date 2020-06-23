# dshipchina-mock

Mocks the [DShipChina Fulfillment API](https://www.dshipchina.com/api.html). Only routes on the `api1` and `api4` endpoints are supported, there's no plans at this time to support the [Seller and Buyer API](https://www.dshipchina.com/api3.html).

## Checklist

### api1

- [x] createorder
- [x] createproduct
- [x] editproduct
- [x] getallproducts
- [x] getanorder
- [x] getaproduct
- [x] getorders
- [ ] getproductflow
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

- Adjust product inventories when orders ship/cancel/return.
- Track product flow.
- Add bill records for "recharging" balance.