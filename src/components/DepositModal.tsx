import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

// components, styles and UI

// interfaces
export interface DepositModalProps {}

const DepositModal: React.FunctionComponent<DepositModalProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="button sub" onClick={() => setOpen(true)}>
        subscribe
      </div>

      <Modal
        classNames={{
          modal: "deposit-modal",
        }}
        open={open}
        onClose={() => setOpen(false)}
        center
        showCloseIcon={false}
      >
        <div className="header">
          <div className="title">Subscribe</div>
          <div className="sub-title">Receive UToken and UOS</div>
        </div>

        <div className="future-details">
          <div className="name">
            <div
              className="token-image"
              style={{
                backgroundImage: `url(/assets/DAI.png)`,
                backgroundSize: "cover",
              }}
            ></div>
            <div>u-aDAI-30-1</div>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="content">
                <div className="title">ends in</div>
                <div className="value">28 days</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">APY</div>
                <div className="value">6%</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">aDAI Balance</div>
                <div className="value">1000</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">total yield</div>
                <div className="value">110</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">your UTokens</div>
                <div className="value">30</div>
              </div>
            </div>
            <div className="card">
              <div className="content">
                <div className="title">your share</div>
                <div className="value">0.002%</div>
              </div>
            </div>
          </div>

          <div className="input-amount">
            <input type="number" placeholder="amount" />
            <div className="submit-button">subscribe</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;
