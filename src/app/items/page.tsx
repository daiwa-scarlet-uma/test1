// app/items/page.tsx
"use client"
import { useEffect, useState } from "react"

interface Item {
  id: number
  name: string
  price: number
}

export default function ItemsPage() {
    // same as above...
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("http://localhost:8000/items/")
            .then((res) => {
                if (!res.ok) throw new Error("请求失败：" + res.status)
                return res.json()
            })
            .then((data) => setItems(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>加载中...</p>
    if (error) return <p>出错了：{error}</p>

    return (
        <div style={{ padding: "1rem" }}>
            <h1>商品列表</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} - ¥{item.price}
                    </li>
                ))}
            </ul>
        </div>
    )
}
