"use client";

export default function CheckoutButton() {

  const handleCheckout = async () => {

    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-6 py-3 bg-black text-white rounded-xl"
    >
      Get Your Blessing
    </button>
  );
}