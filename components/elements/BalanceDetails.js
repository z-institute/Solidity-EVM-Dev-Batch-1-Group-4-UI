import { useState } from "react";
function BalanceDetails() {
    const [open, setOpen] = useState("a1");
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="total-balance">
                        <p>Total Balance</p>
                        <h2>$221,478</h2>
                    </div>
                </div>
            </div>
        </>
    );
}
export default BalanceDetails;
