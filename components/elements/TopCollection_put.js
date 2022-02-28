import { useState } from "react";
import {ZOPNFTFactory} from "../../src/contracts/ZOPNFTFactory.json";


let today = new Date();
let todayDate = today.toISOString().split('T')[0];
// let contractAddress = "";

// let token = eth.contract(ZOPNFTFactory.abi).at(contractAddress);

// let avgPrice = ZOPNFTFactory.getAvgPriceByDay(todayDate);
let range = 2; // from .env file
let base = 10; // from .env file
// let [strikePrice, index] = ZOPNFTFactory.getStrikePrices(todayDate, range, base);


let isPut = true;

const data = [
    {
        id: 1,
        title: todayDate,
        img: "buy.png",
        value: range,
        price: base,
        status: 111,
    },
    {
        id: 2,
        title: todayDate,
        follow: true,
        img: "logo.png",
        value: "positive",
        price: 136305.78,
        status: 104.25,
    },
    {
        id: 3,
        title: "The Sandbox",
        img: "buy.png",
        value: "negative",
        price: 136305.78,
        status: 104.25,
    },
    {
        id: 4,
        title: "The Sandbox",
        img: "buy.png",
        value: "positive",
        price: 136305.78,
        status: 104.25,
    },
    {
        id: 5,
        title: "The Sandbox",
        img: "buy.png",
        value: "negative",
        price: 136305.78,
        status: 104.25,
    },
    {
        id: 6,
        title: "The Sandbox",
        img: "buy.png",
        value: "positive",
        price: 136305.78,
        status: 104.25,
    },
    {
        id: 7,
        title: "The Sandbox",
        img: "buy.png",
        value: "negative",
        price: 136305.78,
        status: 104.25,
    }
    
];
function TopCollection() {
    const [open, setOpen] = useState("p1");
    return (
        <>
            {data.map((item, i) => ( 
                <form className="buyOP">
                    <div className="col-xl-12 col-sm-12 col-md-12">
                        <div className="top-collection-content d-block">
                            <div className="d-flex align-items-center">
                                <span className="serial">{i + 1}. </span>
                                
                                {/* <div className="flex-shrink-0">
                                    <span className="top-img2"><img
                                        className="img-fluid"
                                        src={`/images/${item.img}`}
                                        alt=""
                                        width="70"
                                    /></span>
                                </div> */}

                                <div className="flex-grow-1 ms-3">
                                    <h5>{item.title}</h5>
                                    <p className="text-muted">
                                        <img src="/images/svg/eth.svg" alt="" width={10} className="me-2" />
                                        {item.price}
                                    </p>
                                </div>
                                <h5 class={item.value == "positive" ? "text-success" : "text-danger"}>{item.value == "positive" ? "+" : "-"}{item.status}</h5>

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
export default TopCollection;
