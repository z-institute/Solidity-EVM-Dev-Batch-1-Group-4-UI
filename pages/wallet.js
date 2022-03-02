import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import LineInvestment from "../components/chart/LineInvestment";
import BalanceDetails from '../components/elements/BalanceDetails';
import LayoutAdmin from "../components/layout/LayoutAdmin";
import { ethers } from "ethers";
import ZOPNFTFactoryIF from "../src/contracts/ZOPNFTFactory.json";
import contractAddress from "../src/contracts/contract-address.json";
import TokenAbi from "../src/contracts/ZOPtoken.json";
import ZOPNFTLiquidateIF from "../src/contracts/ZOPNFTLiquidate.json";


const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;
const ZOPNFTLiquidateAddr = contractAddress.ZOPNFTLiquidate;

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const day=20220226;
const base = 10;
const range = 6;
const isPut = true;
const isCall = false;
const pageTitleSub = "ZOPNFT History";
const title = "Wallet";

function Balance({ investmentData }) {
    const [open, setOpen] = useState("a1");
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

    const [tansactionHistory, setTansactionHistory] = useState([]);

    const fetchProducts = async () => {

        const [ethSelectedAddress] = await window.ethereum.enable();
        // console.log("[TOP]:  2!!:", ethSelectedAddress);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log("[TOP]:  4!!: ", provider);
        
        const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr, ZOPNFTFactoryIF.abi, provider.getSigner(0));
        //console.log("[TOP]:  5!!: ", zopnftFactory);

        const avgPrice = (await zopnftFactory.expiryDayToPrice(day)).toString(10);
        // console.log("\navgPrice:", avgPrice);

        const getStrikePricesResult = await zopnftFactory.getStrikePrices(avgPrice, range, base);
        // console.log(getStrikePricesResult.strikePrices, getStrikePricesResult.index);
        
        let strikePrices = getStrikePricesResult.strikePrices;

        var exriryDay = day + 2;
        for (let i = 0; i < getStrikePricesResult.index; i++) {

            //CALL
            const tokenAddressCall = await zopnftFactory.getTokenAddress(exriryDay, isCall, strikePrices[i]);
            const tokenContractCall = new ethers.Contract(tokenAddressCall, TokenAbi.abi, provider.getSigner(0));
            //const tokenContract = new ethers.Contract(tokenAddress, tokenAbi);
            const balanceCall = await tokenContractCall.balanceOf(ethSelectedAddress);
            const nameCall = await tokenContractCall.name();

            let strikePrices_str = (strikePrices[i] / 10).toString(10);
            if (balanceCall > 0) {
                var singleCall= {};
                let balanceCall_str = balanceCall.toString(10);
                // console.log("tokenAddress:%s,isCall,strikePrice:%s,balance:%s", tokenAddressCall, strikePrices_str, balanceCall_str);
                singleCall["opName"] = nameCall;
                singleCall["opAmount"] = balanceCall_str;
                singleCall["opStrikePrice"] = strikePrices_str;
                singleCall["opType"] = "Call";
                singleCall["opAddress"] = tokenAddressCall;
                tansactionHistory.push(singleCall);
            }
            //PUT
            const tokenAddressPut = await zopnftFactory.getTokenAddress(exriryDay, isPut, strikePrices[i]);
            const tokenContractPut = new ethers.Contract(tokenAddressPut, TokenAbi.abi, provider.getSigner(0));
            const balancePut = await tokenContractPut.balanceOf(ethSelectedAddress);
            const namePut = await tokenContractPut.name();
            if (balancePut > 0) {
                var singlePut = {};
                let balancePut_str = balancePut.toString(10);
                // console.log("tokenAddressPut:%s,isPut,strikePrice:%s,balance:%s", tokenAddressPut, strikePrices_str, balancePut_str);
                singlePut["opName"] = namePut;
                singlePut["opAmount"] = balancePut_str;
                singlePut["opStrikePrice"] = strikePrices_str;
                singlePut["opType"] = "Put";
                singlePut["opAddress"] = tokenAddressPut;
                tansactionHistory.push(singlePut);
            }
            // console.log("1122!!", tansactionHistory.length);
        }
        // console.log("end", tansactionHistory.length);
        setTansactionHistory([...tansactionHistory]);
    };

    async function _getReward(opType, strikePrice, amount) {
        try {

            console.log("isPut:", isPut, strikePrice, amount);
            let isPut=1;
            if(opType === 'Call'){
                isPut=0;
            }else{
                isPut=1;
            }
            const [ethSelectedAddress] = await window.ethereum.enable();

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const zopnftLiquidate = new ethers.Contract(ZOPNFTLiquidateAddr,ZOPNFTLiquidateIF.abi,provider.getSigner(0));

            // console.log("!!!!!!!!!!!!ZNtoken-",todayDate, "-", isPut,"-", price," addr: ", ethSelectedAddress, "amount:", amount);
            console.log("transaction sent to zopnftLiquidate: ", isPut, strikePrice, amount);
            let tx = await zopnftLiquidate.getReward(day+2, isPut, strikePrice, amount);
            //let tx = await zopnftLiquidate.getReward(20220228 , 1, 170, 1);
            console.log("transaction sent to zopnftLiquidate: ", day+2, isPut, strikePrice, amount);
            console.log("[getReward] tx.hash: ", tx.hash);
            let receipt = await tx.wait();

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

    useEffect(() => {
        fetchProducts();
    }, []);

    function myFunction() {
        var x = document.getElementById("amountInput");
        x.value = x.value;
    }

    return (
        <>
            <LayoutAdmin
                headTitle={title}
                pageTitle={title}
                pageTitleSub={pageTitleSub}
                pageClass={"admin"}
                parent={"Home"}
                child={title}
            >
                <div className="row">
                    <div className="col-xxl-12 col-xl-12 col-lg-12">
                        <div className="card-header px-0 pt-0">
                            <h4 className="card-title">Latest Transaction</h4>
                        </div>
                        <div className=" top-creators-content">

                            {tansactionHistory.map((item, i) => (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.target);
                                        const amount = formData.get("amount");
                                        if (amount) {
                                            console.log("_getReward: ", item.opType, item.opStrikePrice*10, amount);
                                            _getReward(item.opType, item.opStrikePrice*10, amount);
                                        }
                                    }}
                                    key = {i}>
                            <div className="d-flex justify-content-between creator-widget active  align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="top-creators-info">
                                        <h5 className="mb-0">{item.opName}</h5>
                                        <h5 className="mb-0">{item.opType}</h5>
                                        <h5 className="mb-0">{item.opStrikePrice}</h5>
                                        <p className="mb-2">{item.opAddress}</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="text-primary">{item.opAmount} ZOPT</h5>
                                    <div className="input-group mb-3">
                                        <input type="number" id="amountInput" onKeyUp={myFunction} className="form-control" size="10" aria-label="amount" aria-describedby="basic-addon2" name="amount"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-danger" id="button-addon2" type="submit">Liquidate</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             </form>
                          ))}
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </>
    );
}
const mapStateToProps = (state) => ({
    investmentData: state.LineInvestment.investment,
});
export default connect(mapStateToProps, {})(Balance);
