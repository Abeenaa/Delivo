import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader, ArrowRight, Home } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { paymentAPI } from "../services/api";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS:   "success",
  FAILED:    "failed",
};

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const tx_ref   = searchParams.get("tx_ref");
  const order_id = searchParams.get("order_id");

  useEffect(() => {
    if (!tx_ref || !order_id) {
      setStatus(STATUS.FAILED);
      setErrorMsg("Missing payment reference. Please check your order history.");
      return;
    }

    const verify = async () => {
      try {
        const res = await paymentAPI.verify(tx_ref, order_id);
        if (res.success && res.payment_status === "paid") {
          setStatus(STATUS.SUCCESS);
          setOrderId(res.data?.order_id || order_id);
        } else {
          setStatus(STATUS.FAILED);
          setErrorMsg(res.message || "Payment was not completed.");
        }
      } catch (err) {
        setStatus(STATUS.FAILED);
        setErrorMsg(err.message || "Could not verify payment. Please contact support.");
      }
    };

    verify();
  }, [tx_ref, order_id]);

  return (
    <div className="min-h-screen bg-[#f0fdf4] animate-page-in">
      <Navbar />

      <main className="mx-auto w-full max-w-xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-white p-10 shadow-xl border border-gray-100 text-center">
          {status === STATUS.VERIFYING && (
            <>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6">
                <Loader className="h-10 w-10 text-green-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment…</h1>
              <p className="text-gray-500 text-sm">
                Please wait while we confirm your payment with Chapa.
              </p>
            </>
          )}

          {status === STATUS.SUCCESS && (
            <>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
              <p className="text-gray-600 mb-1">
                Your order has been confirmed and is being prepared.
              </p>
              {orderId && (
                <p className="text-sm text-gray-400 mb-8">Order #{orderId}</p>
              )}

              <div className="flex flex-col gap-3">
                {orderId && (
                  <Link
                    id="track-order-link"
                    to={`/track-order/${orderId}`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-6 py-3.5 font-bold text-white hover:bg-green-800 transition active:scale-95"
                  >
                    Track Your Order <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3.5 font-semibold text-gray-700 hover:bg-gray-200 transition"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </>
          )}

          {status === STATUS.FAILED && (
            <>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">{errorMsg}</p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/order-history"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-6 py-3.5 font-bold text-white hover:bg-green-800 transition"
                >
                  View My Orders
                </Link>
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3.5 font-semibold text-gray-700 hover:bg-gray-200 transition"
                >
                  Try Again
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          🔒 Payments are processed securely by{" "}
          <a
            href="https://chapa.co"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-600"
          >
            Chapa
          </a>
          . Your card details are never stored on our servers.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentVerify;
