import React from 'react'
import './ProdutoItemLista.css'

export default function ProdutoItemLista({produto, editarProduto, deletarProduto}) {
  return (
    <div className='produto-item'>
      <button onClick={deletarProduto}><i className="bi bi-0-circle"></i></button>
      <button onClick={editarProduto}><i className="bi bi-pencil"></i></button>
      <div className="produto-info">
        <span className='produto-nome '>
          {produto.nome}
        </span>
        <span className='produto-quantidade'>
          {produto.quantidade}
        </span>
        <span className='produto-preco'>
          {produto.preco}
        </span>
      </div>
      <input type="checkbox"/>
    </div>
  )
}
