// When this file grows, need to make this a dir. like:
// > Payment
//   - index.ts // Has all exports
//   - razorpay.tsx
//   - ...

import useRazorpay, { RazorpayOptions } from "react-razorpay";

interface PaymentSuccessResponse {
    razorpay_signature: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
}

interface PayOptions {
    description?: string
    name: string
    onPaid(response: PaymentSuccessResponse): void
}

interface Prefill {
    name?: string
    email?: string
    contact?: string
    method?: "netbanking" | "upi" | "card" | "wallet" | "emi"
}

interface Payment {
    pay(amountInPaise: number, options: PayOptions, prefill?: Prefill, receipt?: string, notes?: Record<string, string>): void
}


function usePayment(vendor: "razorpay"): Payment {
    if (vendor === "razorpay") {
        return useRazorPayPayment()
    }
    throw Error("Unknown payment vendor")
}

function useRazorPayPayment() {
    
    const [RazorPay] = useRazorpay();
    
    function pay(amountInPaise: number, options: PayOptions, prefill?: Prefill, receipt?: string, notes?: Record<string, string>) {
        
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            throw Error("NEXT_PUBLIC_RAZORPAY_KEY_ID needs to be defined to use RazorPay")
        }

        fetch("/api/createOrder", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amountInPaise,
                currency: "INR",
                receipt: receipt
            })
        }).then(response => {
            if (!response.ok) {
                alert("Something went wrong. We apologise for the inconveinience. Kindly reach out to shop customer support")
            }
            return response.json()
        }).then(data => {
            const orderId = data.orderId

            const payload: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string, //  we have already checked at top
                amount: amountInPaise.toString(),
                currency: "INR",
                name: options.name,
                description: options?.description,
                handler: options.onPaid,
                order_id: orderId,
                prefill: prefill,
                notes: notes,
            }

            const razorpay = new RazorPay(payload)

            razorpay.open()
        })


    }

    return { pay }

}

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";/* 
import Razorpay from "razorpay";
 */
export default function makeRazorPayCreateOrderHandler(key_id: string | undefined, key_secret: string | undefined): NextApiHandler {
    if (!(key_id && key_secret)) {
        throw Error("Must set NEXT_RAZORPAY_KEY_ID and RAZORPAY_SECRET before setting up orderCreate endpoint")
    }
    
    return async (req: NextApiRequest, res: NextApiResponse) => {
       /*  const instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        }); */

        if (!razorPayRequestBodyvalidate(req.body)) {
            res.status(400).send({ code: "BAD_REQUEST", message: "fields amount and currency are required" })
        }

        function generateAuthorizationHeader(keyId: string, keySecret: string): string {
            const base64token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
            return `Basic ${base64token}`;
        }

        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                'Authorization': generateAuthorizationHeader(key_id, key_secret),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: req.body.amount,
                currency: req.body.currency,
                receipt: req.body.receipt ?? ""
            })
        })
        if (!response.ok) res.status(500).send({ code: "ORDER_ERROR", message: await response.text() })

        const data = await response.json()
        /* const order = await instance.orders.create({
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: req.body.receipt ?? ""
        }) */

        res.status(200).send({ orderId: data.id })
    }
}

function razorPayRequestBodyvalidate(body: any) {
    const required = ['amount', 'currency']

    required.forEach(key => {
        if (!Object.keys(body).includes(key)) {
            return false
        }
    })

    return true
}

export { usePayment, makeRazorPayCreateOrderHandler }