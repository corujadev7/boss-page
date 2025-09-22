import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Mock PIX generation - replace with your actual PIX API integration
    const pixData = {
      qrCode: `/placeholder.svg?height=300&width=300&query=QR Code PIX payment ${amount}`,
      pixCode: `00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/ecedab53-d0b6-438f-aac8-e9e339ddda025204000053039865405${amount.toFixed(2)}.005802BR5923Mangoty Tecnologia Ltda6014RIO DE JANEIRO62290525934490f1a7b03a7c5de2a34e630448A5`,
      expiresIn: 900, // 15 minutes
    }

    return NextResponse.json(pixData)
  } catch (error) {
    console.error("Error generating PIX:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
