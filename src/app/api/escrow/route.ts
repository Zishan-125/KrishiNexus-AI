import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, listingId, totalAmount, paymentGateway } = body;

    // Simulate different transactional operations
    if (action === "LOCK_ESCROW") {
      const transactionId = `SSL_ESC_${Math.floor(100000 + Math.random() * 900000)}`;
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code

      // Simulate SSLCommerz payment hold confirmation
      return NextResponse.json({
        success: true,
        message: "Payment successfully locked in escrow wallet",
        data: {
          orderId: orderId || `ORD_${Math.floor(1000 + Math.random() * 9000)}`,
          transactionId,
          verificationCode,
          paymentGateway,
          amountLocked: totalAmount,
          status: "escrowed",
          timestamp: new Date().toISOString()
        }
      });
    }

    if (action === "RELEASE_ESCROW") {
      const releaseTransactionId = `SSL_REL_${Math.floor(100000 + Math.random() * 900000)}`;

      // Simulate verified handshake release webhook
      return NextResponse.json({
        success: true,
        message: "Escrow funds released directly to farmer mobile wallet!",
        data: {
          orderId,
          releaseTransactionId,
          status: "released",
          timestamp: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
