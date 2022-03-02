import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import ZOPNFTFactoryIF from "../../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../../src/contracts/contract-address.json";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

let today = new Date();
// let todayDate = today.toISOString().split('T')[0].replace("-","");
let todayDate = 20220228;
let priceDate = todayDate-2;
let range = 6; // from .env file
let base = 10; // from .env file
let underlyingAsset = "azuki";
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;

let isPut = true;
// let options = [];
let BasePrice = 0;

function TopCollection_put() {
    const [open, setOpen] = useState("p1");
    const [options, setOptions] = useState([]);

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

    const fetchProducts = async () => {
        // console.log("[TOP]:  2!!:", ZOPNFTFactoryAddr);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log("[TOP]:  4!!: ", provider);
        const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr, ZOPNFTFactoryIF.abi, provider.getSigner(0));
        //console.log("[TOP]:  5!!: ", zopnftFactory);
        const avgPrice = (await zopnftFactory.expiryDayToPrice(priceDate)).toString(10);
        BasePrice = avgPrice;
        // console.log("\nPutavgPrice:", avgPrice);

        const getStrikePricesResult = await zopnftFactory.getStrikePrices(avgPrice, range, base);
        var strikePrices = getStrikePricesResult.strikePrices;
    
    
        for (let i = 0; i < getStrikePricesResult.index; i++) {
            var singleOption ={};

            const strikePrice = (strikePrices[i]).toString(10);
            // console.log("strikePricePut: ", strikePrice);

            const buyPrice = (await zopnftFactory.getBuyPrice(isPut, avgPrice, strikePrice, base) / 10);
            //const buyPrice_str = buyPrice.toString(10);
            //console.log("buyPrice_str: ", buyPrice_str);
            
            singleOption["expiryday"] = todayDate;
            singleOption["strikePrice"] = strikePrice/10;
            singleOption["buyPrice"] = buyPrice;
            options.push(singleOption);
        }
        //console.log("####options.length: ", options.length);
        setOptions(...[options]);
    }

    useEffect(() => {
        fetchProducts();
    }, []);


    async function _mint_buyOP(amount, price, buyPrice) {
        try {
            
            const [ethSelectedAddress] = await window.ethereum.enable();
            
            // We first initialize ethers by creating a provider using window.ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // this.web3 = new Web3(this._provider);
            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));
            
            // console.log("!!!!!!!!!!!!ZNtoken-",todayDate, "-", isPut,"-", price," addr: ", ethSelectedAddress, "amount:", amount);
            let tx = await zopnftFactory.buyOP(todayDate, isPut, price, ethSelectedAddress, amount, {value: ethers.utils.parseEther((buyPrice*amount*0.01).toString(10))});
            //let tx = await zopnftFactory.buyOP(20220228, isPut, 120, ethSelectedAddress, amount);
            
            let options_token_addr = await zopnftFactory.expiryToZNtoken(todayDate, isPut, price);
            // console.log("ZNtoken-",todayDate, "-", isPut,"-",price," addr: ", options_token_addr);

            //console.log("transaction sent to mint buyOP: ", 20220227, 121, ethSelectedAddress, 5);
            console.log("transaction sent to mint buyOP: ", todayDate, isPut, price, amount);
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
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.target);
                        const amount = formData.get("amount");
                        const price = formData.get("strikePrice");
                        if (amount) {
                            _mint_buyOP(amount, price, item.buyPrice);
                        }
                    }}
                    key = {i}>
                    <div style={{ zIndex: '1'}} className="col-xl-12 col-sm-12 col-md-12">
                        <div className="top-collection-content d-block">
                            <div className="d-flex align-items-center">
                                <span className="serial">{underlyingAsset} </span>
                                <span>Put {item.strikePrice} </span>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-muted">
                                        <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" />
                                        {item.buyPrice}
                                    </p>
                                </div>
                                <div className="col-sm-4 col-sm-offset-4">
                                    <span>{item.expiryday}</span>
                                </div>
                                <input id="strikePrice" name="strikePrice" type="hidden" value={item.strikePrice*10} ></input>
                                <div className="col-sm-4 col-sm-offset-4">
                                <label htmlFor="basic-url" className="form-label">amount</label>
                                    <div className="input-group mb-3">
                                        <input type="number" onKeyUp={myFunction} id="amountInput" 
                                               className="form-control" size="10" aria-label="amount"
                                               aria-describedby="basic-addon2" name="amount"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" type="button" type="submit">BUY</button>
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
