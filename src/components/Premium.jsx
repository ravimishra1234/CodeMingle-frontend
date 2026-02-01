import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Code Mingle",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (isUserPremium) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="card bg-neutral shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🎉 Premium Activated
          </h1>
          <p className="text-gray-300">
            You already have access to all premium features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Upgrade to Premium</h1>
        <p className="text-gray-400">
          Unlock advanced features and connect without limits
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Silver */}
        <div className="card bg-neutral rounded-2xl shadow-xl p-8 flex-1">
          <h2 className="font-bold text-2xl mb-6 text-center">
            Silver Membership
          </h2>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li className="flex items-center gap-3">
              <span className="text-secondary">✔</span>
              <span>Chat with other people</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-secondary">✔</span>
              <span>100 connection requests per day</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-secondary">✔</span>
              <span>Blue Tick</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-secondary">✔</span>
              <span>Valid for 3 months</span>
            </li>
          </ul>

          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-secondary w-full rounded-xl"
          >
            Buy Silver
          </button>
        </div>

        <div className="divider md:divider-horizontal">OR</div>

        {/* Gold */}
        <div className="card bg-neutral rounded-2xl shadow-xl p-8 flex-1 border border-primary/40">
          <h2 className="font-bold text-2xl mb-6 text-center text-primary">
            Gold Membership
          </h2>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li className="flex items-center gap-3">
              <span className="text-primary">✔</span>
              <span>Chat with other people</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✔</span>
              <span>Infinite connection requests</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✔</span>
              <span>Blue Tick</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✔</span>
              <span>Valid for 6 months</span>
            </li>
          </ul>

          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary w-full rounded-xl"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
