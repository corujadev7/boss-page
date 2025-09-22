"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Users, DollarSign } from "lucide-react"
import axios from 'axios'
import { QRCodeCanvas } from "qrcode.react"

interface PixData {
  qrCode: string
  pixCode: string
  expiresIn: number
}

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [copied, setCopied] = useState(false)

  const donationAmounts = [20, 30, 40, 50, 100, 200, 300, 500, 1000]

  const generatePixPayment = async (amount: number): Promise<PixData> => {
    setLoadingAmount(amount)

    try {
      const payload = { amount: amount * 100 }
      const response = await axios.post("https://api-checkout-one.vercel.app/create-transaction", payload)

      // backend devolve { id, qrcode }
      const { qrcode } = response.data

      // adapta para PixData
      const pixData: PixData = {
        qrCode: "",        // se backend não mandar imagem, pode gerar via lib de QRCode
        pixCode: qrcode,     // usa o campo que a BlackCat manda
        expiresIn: 900       // tempo padrão de 15min
      }

      return pixData
    } finally {
      setLoadingAmount(null)
    }
  }

  const handleDonationClick = async (amount: number) => {
    setSelectedAmount(amount)

    const data = await generatePixPayment(amount)

    setPixData(data)
    setTimeLeft(data.expiresIn)
    setShowPayment(true)
  }

  const copyPixCode = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.pixCode)
      setCopied(true)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const closePayment = () => {
    setShowPayment(false)
    setPixData(null)
    setSelectedAmount(null)
    setTimeLeft(0)
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Juntos pelo Brasil</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Sua doação vai ajudar Bolsonaro a enfrentar essa multa abusiva e a mostrar que o povo não aceita essa
            injustiça.
          </p>
        </div>
      </div>

      {/* Yellow Banner */}
      <div className="bg-yellow-400 text-black py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Uma batalha que não é só de Bolsonaro</h2>
          <p className="text-lg max-w-4xl mx-auto">
            O que está em jogo não é apenas a liberdade de um homem. É o futuro do Brasil livre. Se hoje eles conseguem
            esmagar Bolsonaro com uma multa desproporcional, amanhã qualquer brasileiro que ouse discordar poderá ser
            vítima da ditadura do STF.
          </p>
        </div>
      </div>

      {/* Video and Stats Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="relative rounded-lg overflow-hidden mb-8">
              <div className="aspect-[9/16]">
                <iframe
                  id="panda-01541c18-0bb9-42b1-8cc2-fa39477a5d86"
                  src="https://player-vz-898a9fff-bc4.tv.pandavideo.com.br/embed/?v=01541c18-0bb9-42b1-8cc2-fa39477a5d86"
                  className="w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Pessoas participantes</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">15.958</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Total arrecadado</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">R$ 529.700,00</p>
              </Card>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Meta da campanha</span>
                <span className="text-sm font-medium">27%</span>
              </div>
              <Progress value={27} className="h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Donation Section */}
      <div className="bg-green-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O futuro do Brasil está em sua colaboração!</h2>
            <p className="text-xl opacity-90">
              Cada contribuição mostra que o povo está ao lado de Bolsonaro e contra a ditadura do STF.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {donationAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => handleDonationClick(amount)}
                disabled={loadingAmount === amount}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg text-lg"
              >
                {loadingAmount === amount ? "Carregando..." : `R$ ${amount},00`}
              </Button>
            ))}
          </div>

          {showPayment && pixData && (
            <div className="max-w-md mx-auto mb-12">
              <Card className="bg-white text-black p-6">
                <div className="text-center mb-4">
                  <h3 className="text-blue-600 font-semibold mb-2">QR Code pronto para pagamento</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    O código expira em: <span className="text-red-500 font-bold">00:{formatTime(timeLeft)}</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 mb-2 break-all">{pixData.pixCode}</p>
                </div>

                <Button
                  onClick={copyPixCode}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 mb-4"
                >
                  {copied ? "COPIADO" : "COPIAR CÓDIGO"}
                </Button>

                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-4">Escaneie o QR CODE ou copie o código</p>
                  <div className="flex justify-center">
                    <QRCodeCanvas
                      value={pixData.pixCode}
                      size={200}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"H"}
                      includeMargin={true}
                    />
                  </div>
                </div>

                <Button
                  onClick={closePayment}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 mt-4"
                >
                  Fechar
                </Button>
              </Card>
            </div>
          )}

          {/* Information Sections */}
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Para onde vai a Doação?</h3>
              <p className="text-lg opacity-90 mb-2">
                Sua doação é destinada para quitação das multas impostas ao <strong>Jair Messias Bolsonaro</strong>, que
                ultrapassam mais de <strong>R$ 1.378.400</strong>. Esta arrecadação é uma forma de mostrar que estamos
                ao lado do nosso capitão.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Qual a importância dessa doação?</h3>
              <p className="text-lg opacity-90">
                Mais do que um valor financeiro, essa arrecadação demonstra que o povo está unido e disposto a defender
                a liberdade e a justiça. Cada doação simboliza resistência contra perseguições consideradas políticas.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Essa arrecadação é Oficial do Bolsonaro?</h3>
              <p className="text-lg opacity-90 mb-4">
                Todos os valores arrecadados são administrados pela <strong>Organização Oficial do Bolsonaro</strong>,
                que presta contas regularmente por meio de relatórios públicos e auditorias legalizadas. Também conta
                com o apoio de Deputados e Senadores apoiadores de direita.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Esta arrecadação conta com apoio de:</h3>
              <ul className="text-lg space-y-2 max-w-md mx-auto">
                <li>• Nikolas Ferreira (PL-MG)</li>
                <li>• Eduardo Bolsonaro (PL-SP)</li>
                <li>• Flávio Bolsonaro (PL-RJ)</li>
                <li>• Bia Kicis (PL-DF)</li>
                <li>• Carla Zambelli (PL-SP)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-purple-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">© 2025 Bancada da direita • Brasil Unido</p>
        </div>
      </div>
    </div>
  )
}
