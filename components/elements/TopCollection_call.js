import React, {useEffect, useState} from "react";
import Link from "next/link"
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
let zoptions = [];
let BasePrice = 0;





function TopCollection_call() {
    const [open, setOpen] = useState("p1");

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
    //setselectedAddress('0x1');
    //console.log("selectedAddress: ", selectedAddress);


    const fetchProducts = async () => {
        // console.log("[TOP]:  2!!:", ZOPNFTFactoryAddr);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log("[TOP]:  4!!: ", provider);
        // this.web3 = new Web3(this._provider);
        const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr, ZOPNFTFactoryIF.abi, provider.getSigner(0));
        //console.log("[TOP]:  5!!: ", zopnftFactory);
        const avgPrice = (await zopnftFactory.expiryDayToPrice(priceDate)).toString(10);
        BasePrice = avgPrice;
        console.log("\nCallavgPrice:", avgPrice);
    
        const getStrikePricesResult = await zopnftFactory.getStrikePrices(avgPrice, range, base);
        var strikePrices = getStrikePricesResult.strikePrices;
    
    
        for (let i = 0; i < getStrikePricesResult.index; i++) {
            var singleOption ={};

            const strikePrice = (strikePrices[i]).toString(10);
            console.log("strikePriceCall: ", strikePrice);

            const buyPrice = (await zopnftFactory.getBuyPrice(isPut, avgPrice, strikePrice, base) / 10).toString(10);
            console.log("buyPrice: ", buyPrice);
            
            singleOption["expiryday"] = todayDate;
            singleOption["strikePrice"] = buyPrice;
            singleOption["buyPrice10x"] = strikePrice;
            singleOption["buyPrice"] = buyPrice;
            zoptions.push(singleOption);
        }
        //console.log("####options.length: ", zoptions.length);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    async function _mint_buyOP(amount, price) {
        try {
            
            const [ethSelectedAddress] = await window.ethereum.enable();
            
            //this.setselectedAddress(ethSelectedAddress);
            
            // We first initialize ethers by creating a provider using window.ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            
            // this.web3 = new Web3(this._provider);
            const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr,ZOPNFTFactoryIF.abi,provider.getSigner(0));
            
            //let tx = await zopnftFactory.buyOP(20220227, 0, 121, ethSelectedAddress, 5);
            //let options_token_addr = await zopnftFactory.expiryToZNtoken(20220227, 121);
            //console.log("ZNtoken-0-20220227-121 addr: ", options_token_addr);
            console.log("!!!!!!!!!!!!ZNtoken-",todayDate, "-", isPut,"-", price," addr: ", ethSelectedAddress, "amount:", amount);
            let tx = await zopnftFactory.buyOP(todayDate, isPut, price, ethSelectedAddress, amount);
            //let tx = await zopnftFactory.buyOP(20220228, isPut, 120, ethSelectedAddress, amount);
            
            let options_token_addr = await zopnftFactory.expiryToZNtoken(todayDate, isPut, price);
            console.log("ZNtoken-",todayDate, "-", isPut,"-",price," addr: ", options_token_addr);


            //let tx = await zopnftFactory.buyOP(todayDate, price, amount)
            
            //console.log("transaction sent to mint buyOP: ", 20220227, 121, ethSelectedAddress, 5);
            console.log("transaction sent to mint buyOP: ", todayDate, isPut, price, amount);
            setState({ txBeingSent: tx.hash });
            console.log("[buyOP] tx.hash: ", tx.hash)
            let receipt = await tx.wait()

            /*
            this.setState({ NFTs: this.state.NFTs.concat({
                name: '',
                nftContractName: 'NFTSimple',
                nftContractAddr: this.zopnftFactory.address,
                thumbnail: '',
                openseaLink: '',
                tokenId: receipt.events[0].args[2]
              })});
            */

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            //await this._updateBalance();

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

    return (
        <>

            {zoptions.map((item, i) => (
                <form
                    onSubmit={(event) => {
                        // This function just calls the transferTokens callback with the
                        // form's data.
                        event.preventDefault();
                        const formData = new FormData(event.target);
                        const amount = formData.get("amount");
                        //amount
                        if (amount) {

                            _mint_buyOP(amount, item.buyPrice10x);
                        }
                    }}
                    className="buyOP">
                <div className="col-xl-12 col-sm-12 col-md-12">
                        <div className="top-collection-content d-block">
                            <div className="d-flex align-items-center">
                                <span className="serial">{underlyingAsset}</span>
                                <span>Call-{item.strikePrice} </span>
                                <div className="flex-grow-1 ms-3">
                                    <p className="text-muted">
                                        <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" />
                                        {item.buyPrice}
                                    </p>
                                </div>
                                <span>{item.expiryday}-{item.buyPrice10x/10} <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" /></span>
                                <div class="col-sm-4 col-sm-offset-4">
                                <label for="basic-url" class="form-label">amount</label>
                                    <div class="input-group mb-3">
                                        <input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" class="form-control" size="10" aria-label="amount" aria-describedby="basic-addon2" name="amount"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" type="submit">BUY</button>
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
export default TopCollection_call;
