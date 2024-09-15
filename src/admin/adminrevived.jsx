import React from "react";
import anaesthesia from "../Images/anaesthesia 1.png"

const Adminrevived = () =>{
    return(
        <section>
            <div className="container">
                <h3 className="pured">Purchased   </h3>
                <div className="row tab-conn">
                <div className="col-1"></div>
                <div className="col-3">
                    <img width={200} src={anaesthesia} alt="" />
                    <h3 className="thesia">Anesthesia</h3>
                </div>
                <div className="col-7">
                    <h4>Argun</h4>
                    <p>Anesthesia is a medical procedure that uses drugs to temporarily and controllably block sensation or awareness for medical or veterinary purposes. </p>
                    <button className="tab-read">Readmore</button>
                    {/* <p className="pricese"> price : <span>300</span></p> */}
                </div>
                <div className="col-1"></div>
            </div>
            <div className="row tab-conn">
                <div className="col-1"></div>
                <div className="col-3">
                    <img width={200} src={anaesthesia} alt="" />
                    <h3 className="thesia">Anesthesia</h3>
                </div>
                <div className="col-7">
                    <h4>Argun</h4>
                    <p>Anesthesia is a medical procedure that uses drugs to temporarily and controllably block sensation or awareness for medical or veterinary purposes. </p>
                    <button className="tab-read">Readmore</button>
                    {/* <p className="pricese"> price : <span>300</span></p> */}
                </div>
                <div className="col-1"></div>
            </div>
            </div>
        </section>
    )
}


export default Adminrevived;