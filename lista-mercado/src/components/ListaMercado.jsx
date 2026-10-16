import React, { useEffect, useState, useRef } from 'react'
import './ListaMercado.css'
import ProdutoItemLista from './ProdutoItemLista'
import 'bootstrap-icons/font/bootstrap-icons.css';

function ListaMercado() {
    const [nomeProduto, setNomeProduto] = useState('')
    const [quantidadeProduto, setQuantidadeProduto] = useState(1)
    const [precoProduto, setPrecoProduto] = useState(0)
    const [idProdutoEditando, setIdProdutoEditando] = useState(null)
    const [valorTotalTela, setValorTotalTela] = useState(0)

    const inputNome = useRef(null)

    const [lista, setLista] = useState([])

    const fetchLista = ()=>{
        // fetch('http://localhost:3001/tasks')
        fetch('http://localhost:3000/quote')
        .then(response => response.json())
        .then(data => setLista(data))
        .catch(error => console.error('Erro ao buscar lista '))
    }

    useEffect(()=>{
        fetchLista()
        if(inputNome.current) inputNome.current.focus()
    },[])

    useEffect(()=>{
        if(inputNome.current) inputNome.current.focus()
        setValorTotalTela(lista.reduce((total, produto) =>  produto.verificado ? total + (produto.preco * produto.quantidade) : total, 0))
    },[lista])
    
    const adicionarProdutoLista = ()=>{
        const novoId = lista.length
        if(nomeProduto === '') return
        const produtoTela = {id: novoId, nome: nomeProduto, quantidade: quantidadeProduto, preco: precoProduto, verificado: true}
        const valorTotal = precoProduto * quantidadeProduto
        setValorTotalTela(valorTotalTela + valorTotal)
        // fetch('http://localhost:3001/tasks',{
        fetch('http://localhost:3000/quote',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(produtoTela)
        })
        .then(response => response.json())
        .then(data => setLista([...lista, data]))
        setNomeProduto('')
        setQuantidadeProduto(1)
        setPrecoProduto(0)
    }

    const editarProtudoLista = (id)=>{
        setIdProdutoEditando(id)
        setNomeProduto(lista.find(produto => produto.id === id).nome)
        setQuantidadeProduto(lista.find(produto => produto.id === id).quantidade)
        setPrecoProduto(lista.find(produto => produto.id === id).preco)
        if(inputNome.current) inputNome.current.focus()
    }

    const deletarProduto = (id)=>{
        // fetch(`http://localhost:3001/tasks/${id}`, {
        fetch(`http://localhost:3000/quote/${id}`, {
            method: 'DELETE'
        })
        .then(() => setLista(lista.filter(produto => produto.id !== id)))
    }

    const botaoEditarProdutoLista = ()=>{
        fetch(`http://localhost:3001/tasks/${idProdutoEditando}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nome: nomeProduto, quantidade: quantidadeProduto, preco: precoProduto})
        })
        .then(res=> res.json())
        .then(()=>{ 
            setLista(lista.map(produto => produto.id === idProdutoEditando ? {...produto, nome: nomeProduto, quantidade: quantidadeProduto, preco: precoProduto} : produto))
            setNomeProduto('')
            setQuantidadeProduto('')
            setPrecoProduto('')
            setIdProdutoEditando(null)
        })  
    }

    const verificarProduto = (id, verificado) =>{
        fetch(`http://localhost:3001/tasks${id}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({verificado: !verificado})
        })
        .then(response=> response.json())
        .then(()=> setLista(lista.map(produto => produto.id === id? {...produto, verificado: !verificado}: produto)))
    }
  return (
    <>
    <div className="main-container">
        <div className='head-container'>
            <div className='titulo-container'>
                <i className="bi bi-basket"></i>
                <p className='titulo-lista'>É de casa</p>
            </div>            
            <p className='campo-valorTotal'>{valorTotalTela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>

        {lista.map((produto)=>(
            <ProdutoItemLista 
            key={produto.id}
            produto={produto}
            editarProduto={()=> editarProtudoLista(produto.id)}
            deletarProduto={()=> deletarProduto(produto.id)}
            verificarProduto={()=> verificarProduto(produto.id, produto.verificado)}
            />
        ))}

        <div className='inputs-container'>
            <input className='input-nomeProduto' type="text" ref={inputNome} value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} placeholder='nome produto'/>
            <input className='input-quantidadeProduto' type="text" value={quantidadeProduto} onChange={(e) => setQuantidadeProduto(e.target.value)} placeholder='1'/>
            <input className='input-precoProduto' type="text" value={precoProduto} onChange={(e) => setPrecoProduto(e.target.value)} placeholder='88,88'/>
            {
            idProdutoEditando !== null ? <button onClick={botaoEditarProdutoLista}>/</button> : <button onClick={adicionarProdutoLista}>+</button>
            }
        </div>
    </div>           
    </>
  )
}

export default ListaMercado
