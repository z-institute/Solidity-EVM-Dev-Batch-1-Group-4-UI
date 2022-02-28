import React, {useEffect, useState} from "react";
import Link from "next/link"
import { ethers } from "ethers";
import ZOPNFTFactoryIF from "../../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../../src/contracts/contract-address.json";


let today = new Date();
// let todayDate = today.toISOString().split('T')[0].replace("-","");
let todayDate = 20220226;
let range = 2; // from .env file
let base = 10; // from .env file
let underlyingAsset = "azuki";
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;

let isPut = true;
let options = [];


function TopCollection_put() {
    const [open, setOpen] = useState("p1");
    
    const fetchProducts = async (callPriceArry, putPriceArry) => {
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr, ZOPNFTFactoryIF.abi, provider.getSigner(0));
        
        const avgPrice = (await zopnftFactory.expiryDayToPrice(todayDate)).toString(10);
    
        const getStrikePricesResult = await zopnftFactory.getStrikePrices(avgPrice, range, base);
        var strikePrices = getStrikePricesResult.strikePrices;
    
    
        for (let i = 0; i < getStrikePricesResult.index; i++) {
            var singleOption ={};

            const strikePrice = (strikePrices[i]).toString(10);
            console.log("strikePrice: ", strikePrice);

            const buyPrice = (await zopnftFactory.getBuyPrice(isPut, avgPrice, strikePrice, base) / 10).toString(10);
            console.log("buyPrice: ", buyPrice);
            
            singleOption["expiryday"] = todayDate;
            singleOption["strikePrice"] = strikePrice/10;
            singleOption["buyPrice"] = buyPrice;
            options.push(singleOption);
        }
        console.log("####options.length: ", options.length);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>  
            {options.map((item, i) => ( 
                <form className="buyOP">
                    <div className="col-xl-12 col-sm-12 col-md-12">
                        <div className="top-collection-content d-block">
                            <div className="d-flex align-items-center">
                                <span className="serial">{underlyingAsset} </span>
                                <span>Put-{item.strikePrice} </span>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-muted">
                                        <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" />
                                        {item.buyPrice}
                                    </p>
                                </div>
                                <span>expiryday {item.expiryday} </span>

                                <div class="col-sm-4 col-sm-offset-4">
                                <label for="basic-url" class="form-label">amount</label>
                                    <div class="input-group mb-3">
                                        <input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" class="form-control" size="10" aria-label="amount" aria-describedby="basic-addon2"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button">BUY</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>   
            ))}
        </>
    );
}
export default TopCollection_put;
