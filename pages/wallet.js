import {useEffect, useState} from "react";
import { connect } from "react-redux";
import LineInvestment from "../components/chart/LineInvestment";
import BalanceDetails from '../components/elements/BalanceDetails';
import LayoutAdmin from "../components/layout/LayoutAdmin";


import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import ZOPNFTFactoryIF from "../src/contracts/ZOPNFTFactory.json";

import contractAddress from "../src/contracts/contract-address.json";


const HARDHAT_NETWORK_ID = '1337';
const NeverFightTwiceAddr = contractAddress.NeverFightTwice;
const NFTSimpleAddr = contractAddress.NFTSimple;
const ZOPNFTFactoryAddr = contractAddress.ZOPNFTFactory;
const options = {method: 'GET', cache: "no-store"};

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const base = 10;
const range = 6;
const isPut = true;
const isCall = false;

//先建立一個空陣列
let lists_callPrice = [];
let lists_putPrice = [];

function Balance({ investmentData }) {
    const [open, setOpen] = useState("a1");

    const fetchProducts = async () => {
        // You can await here
        console.log('[TOP]:  layoutFront!!!!!!!!!!!!!');
        console.log("[TOP]:  1!!");
        const [ethSelectedAddress] = await window.ethereum.enable();
        console.log("[TOP]:  2!!:", ethSelectedAddress);

        //this.setselectedAddress(ethSelectedAddress);
        console.log("[TOP]:  3!!");
        // We first initialize ethers by creating a provider using window.ethereum
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("[TOP]:  4!!: ", provider);
        // this.web3 = new Web3(this._provider);
        const zopnftFactory = new ethers.Contract(ZOPNFTFactoryAddr, ZOPNFTFactoryIF.abi, provider.getSigner(0));
        //console.log("[TOP]:  5!!: ", zopnftFactory);

        let day=20220226;

        //const avgPrice = await zopnftFactory.expiryDayToPrice(20220226);
        //const avgPrice_real = (avgPrice / 10).toString(10);
        //console.log("\navgPrice:", avgPrice);
        //console.log("\navgPrice_real:", avgPrice_real);



        const avgPrice = await zopnftFactory.expiryDayToPrice(day);
        const avgPrice_real = (avgPrice / 10).toString(10);
        console.log("\navgPrice:", avgPrice);
        console.log("\navgPrice_real:", avgPrice_real);

        const getStrikePricesResult = await zopnftFactory.getStrikePrices(avgPrice, range, base);
        // console.log(getStrikePricesResult.strikePrices);
        // console.log("\nindex:", getStrikePricesResult.index);
        let strikePrices = getStrikePricesResult.strikePrices;

        const tokenAbi = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_underlyingAsset",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_strikeAsset",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_strikePrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_buyPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_expiryDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "_isPut",
                        "type": "bool"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "burnZNtoken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "buyPrice",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "expiryDay",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getZNtokenDetails",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "isPut",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "mintZNtoken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "strikeAsset",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "strikePrice",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferZNtoken",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "_isTransfer",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "underlyingAsset",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        var exriryDay = day + 2;
        for (let i = 0; i < getStrikePricesResult.index; i++) {
            //CALL
            const tokenAddressCall = await zopnftFactory.getTokenAddress(exriryDay, isCall, strikePrices[i]);
            const tokenContractCall = new ethers.Contract(tokenAddressCall, tokenAbi, provider.getSigner(0));
            //const tokenContract = new ethers.Contract(tokenAddress, tokenAbi);
            const balanceCall = await tokenContractCall.balanceOf(ethSelectedAddress);
            const nameCall = await tokenContractCall.name();

            let strikePrices_str = (strikePrices[i] / 10).toString(10);
            if (balanceCall > 0) {
                let balanceCall_str = balanceCall.toString(10);
                console.log(nameCall);
                console.log("tokenAddress:%s,isCall,strikePrice:%s,balance:%s", tokenAddressCall,strikePrices_str, balanceCall_str);
            }
            //PUT
            const tokenAddressPut = await zopnftFactory.getTokenAddress(exriryDay, isPut, strikePrices[i]);
            const tokenContractPut = new ethers.Contract(tokenAddressPut, tokenAbi, provider.getSigner(0));
            const balancePut = await tokenContractPut.balanceOf(ethSelectedAddress);
            const namePut = await tokenContractPut.name();
            if (balancePut > 0) {
                let balancePut_str = balancePut.toString(10);
                console.log(namePut);
                console.log("tokenAddressPut:%s,isPut,strikePrice:%s,balance:%s", tokenAddressPut, strikePrices_str, balancePut_str);
            }else{
                console.log("...");
            }
        }
        console.log("end");
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <>
            <LayoutAdmin
                headTitle="Wallet"
                pageTitle="Wallet"
                pageTitleSub={"ZOPNFT Wallet page"}
                pageClass={"admin"}
                parent={"Home"}
                child={"Wallet"}
            >
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <div className="card-header px-0 pt-0">
                            <h4 className="card-title">Latest Transaction</h4>
                            <a href="#">See More</a>
                        </div>
                        <div className=" top-creators-content">
                            <div className="d-flex justify-content-between creator-widget active  align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="top-creators-user-img me-3">
                                        <img src="/images/items/item_1.png" alt="" width="60" />
                                    </div>
                                    <div className="top-creators-info">
                                        <h5 className="mb-0">Terry Camacho</h5>
                                        <p className="mb-2">60 Items</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="text-primary">0.2658 ETH</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between creator-widget active  align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="top-creators-user-img me-3">
                                        <img src="/images/items/item_1.png" alt="" width="60" />
                                    </div>
                                    <div className="top-creators-info">
                                        <h5 className="mb-0">Terry Camacho</h5>
                                        <p className="mb-2">60 Items</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="text-primary">0.2658 ETH</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between creator-widget active  align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="top-creators-user-img me-3">
                                        <img src="/images/items/item_1.png" alt="" width="60" />
                                    </div>
                                    <div className="top-creators-info">
                                        <h5 className="mb-0">Terry Camacho</h5>
                                        <p className="mb-2">60 Items</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="text-primary">0.2658 ETH</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <h4 className="card-title mb-3">Balance Details</h4>
                        <div className="card">
                            <div className="card-body">
                                <BalanceDetails />
                            </div>
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
