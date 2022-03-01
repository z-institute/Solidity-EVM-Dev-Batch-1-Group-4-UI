import React, {useEffect, useState} from "react";
import Link from "next/link"
import { ethers } from "ethers";
import ZOPNFTFactoryIF from "../../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../../src/contracts/contract-address.json";


let today = new Date();
// let todayDate = today.toISOString().split('T')[0].replace("-","");
const todayDate = 20220226;
const range = 2; // from .env file
const base = 10; // from .env file
const underlyingAsset = "azuki";
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const isPut = false;
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
        // console.log("####put options.length: ", options.length);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const initialState = {
        // The info of the token (i.e. It's Name and symbol)
        tokenData: undefined,
        // The user's address and balance
        selectedAddress: undefined,
        balance: undefined,
        // The ID about transactions being sent, and any possible error with them
        txBeingSent: undefined,
        transactionError: undefined,
        networkError: undefined,
    };

    const [State, setState] = useState(initialState);

    async function _mint_buyOP(date, optype, price, amount) {
        try {
            const [ethSelectedAddress] = await window.ethereum.enable();

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));

            let tx = await zopnftFactory.buyOP(date, optype, price, ethSelectedAddress, amount);

            setState({ txBeingSent: tx.hash });
            console.log("[buyOP] tx.hash: ", tx.hash)
            let receipt = await tx.wait()

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }
            console.error(error);
            setState({ transactionError: error });
        } finally {
            setState({ txBeingSent: undefined });
        }
    }

    function myFunction() {
        var x = document.getElementById("amountInput");
        x.value = x.value;
    }

    return (
        <>  
            {options.map((item, i) => ( 
                <div className="col-xl-12 col-sm-12 col-md-12">
                    <div className="top-collection-content d-block">
                    <form onSubmit={(event) => {
                                    console.log("##", "form");
                                        event.preventDefault();
                                        const formData = new FormData(event.target);
                                        const date = formData.get("expiryDay");
                                        const optype = false;
                                        const price = formData.get("strikePrice");
                                        const amount = formData.get("amount");
                                        //date, price, amount
                                        if (date || price || amount) {
                                            console.log("##", date, optype, price, amount);
                                            _mint_buyOP(date, optype, price, amount);
                                        }
                                    }}
                            >
                        <div className="d-flex align-items-center">
                                <span className="serial">{underlyingAsset} </span>
                                <span>Put-{item.strikePrice} </span>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-muted">
                                        <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" />
                                        {item.buyPrice}
                                    </p>
                                </div>
                                <input id="expiryDay" name="expiryDay" type="hidden" value={item.expiryday}></input>
                                <input id="strikePrice" name="strikePrice" type="hidden" value={item.strikePrice*10} ></input>
                                <div class="col-sm-4 col-sm-offset-4">
                                    <span>expiryday {item.expiryday} </span>
                                </div>
                                <div class="col-sm-4 col-sm-offset-4">
                                <label for="basic-url" class="form-label">amount</label>
                                    <div class="input-group mb-3">
                                        <input type="number" name="amount" onkeyup="this.value=this.value.replace(/\D/g,'')" class="form-control" size="10" aria-label="amount" aria-describedby="basic-addon2"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="submit">BUY</button>
                                        </div>
                                    </div>
                                </div>
                          
                        </div>  </form> 
                    </div>
                    
                </div>
            ))}
        </>
    );
}
export default TopCollection_put;
