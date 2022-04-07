import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch,useAppSelector } from '../hooks'
import { closeVendingMachineDialogOpen } from '../stores/VendingMachineStore'
import { Button } from '@mui/material'
import GameItemCard from './NFTstore/GameDetailItem'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import GameDetailItem from './NFTstore/GameDetailItem'
import SmallItemCard from '../../components/Card/SmallItemCard'

const Wrapper = styled.div`
  border-radius: 5px;
  width: 80vw;
  height: 90vh;
  background: white;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #0000006f;
  .close {
    color: black;
    position: absolute;
    top: 1vh;
    right: 2vw;
  }
`
const ColorBar = styled.div`
    margin: auto;
    margin-top:0;
    width: 100vw ;
  img{
    margin: auto;
    width: 100vw ;
    height: 20vh;
    object-fit: cover;
  }
  .all{
    object-position:10% 10%;
  }
  .art{
    object-position:70% 70%;
  }
  .music{
    object-position:70% 70%;
  }
  .photography{
    object-position:40% 40%;
  }
  .sports{
    object-position:90% 90%;
  }
  .game{
    object-position:60% 60%;
  }
`
const Title = styled.div`
  display:flex ;
  justify-content:space-around;
  h1{
    font-size: 4rem;
  }
  p{
    margin-top: 10vh;
    font-weight: 600;
    font-size: 1.5rem;
  }
  margin-bottom: 0;
`
const CategoryBar = styled.div`
  margin: auto;
  margin-top: 5vh;
  width: 70% ;
  display: flex;
  li{
    margin: auto;
  }
  p{
    font-size:3vh;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    text-align: center;
  }
  p::before{
    content: "";
    height: 5px;
    width: 0px;
    background-color: #F43B00;
    border-radius: 10px;
    transition: 0.3s;
    position: absolute;
    bottom: -0.5rem;
  }
  p:hover::before{
    width: 100%;
    background-color: #F43B00;
  }
  #category::before{
    width: 100%;
    background-color: #F43B00;
  }
`
const ItemCards = styled.div`
  margin:auto ;
  width: 80% ;
  display: flex ;
  flex-wrap: wrap ;
  justify-content:center ;
`
const ModalWrapper = styled.div`
   position: absolute;
    bottom: 10vh;
    right: 20vw;
  width: 7rt0vw;
  height: 80vh;
  color: #eee;
  background: white;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 5px;
  padding: 15px 35px 15px 15px;

  .close {
    position: absolute;
    top: 2px;
    right: 2px;
  }

  .tip {
    margin-left: 12px;
  }
`
const StoreWapper = styled.div`
  .nftstore{
    margin-left: 1vw;
    margin-top: 2vh;
    width: 80vw;
    height: 78vh;
    overflow: auto;
    color: black;
    overflow-y:scroll;
    overflow-x:hidden;
    &::-webkit-scrollbar{width: 10px; height:12px;}
    &::-webkit-scrollbar-thumb{ background-color: teal; border-radius: 10px; } 
    &::-webkit-scrollbar-track{ background-color: #fbe9e1;}
  }
  .img{
    margin-left: 15vw;
    margin-top:1vh;
    margin-bottom: 0;
    width: 50vw;
    height: 35vw;
    border: 0.5px solid gray;
  }
  .btnbox{
    display: flex;
    width: 50vw;
    margin: auto;
    margin-top:3vh;
    justify-content: space-between;
  }
  .btn{
    width: 24.5vw;
    height: 5vh;
  }
`
interface Istate{
  item: {
    productFavoriteUser: Array<any>;
    productId: number;
    productTitle: string;
    productPrice: number;
    productThumbnailUrl: string;
    productFavorite: number;
    productRegDt: Object;
    productCode: number;
    productState: number;
    productFavoriteCount: number;
    favorite: boolean;
    tokenId?: number;
    userRole: string;
  }; 
}

const VendingMachineDialog = () => {
  const [nftnumber,setNftnumber] = useState(useAppSelector((state)=>state.vendingMachine.nftnumber))
  const [userProducts,setUserProducts] = useState(useAppSelector((state)=>state.user.userProducts))
  const [imgurl,setImgurl] = useState('')
  const dispatch = useAppDispatch()
  const [mode,setMode]  = useState('display')
  const [filter,setFilter] = useState("all")
  const [items,setItems] = useState<Istate['item'][]>([])

  useEffect(() => {
    userProducts.content.map((product) => {
      if(product.productId === nftnumber) {
        setImgurl(product.productFileUrl)
      }
    })
  },[nftnumber])

  return (
    <ModalWrapper>
        {mode ==='display' &&
          <StoreWapper>
            <IconButton size="small" className="close" onClick={() => dispatch(closeVendingMachineDialogOpen())}>
              <CloseIcon />
            </IconButton>
            <div className='display'>
              <img className='img' src={imgurl} alt='작품'/>
              <div className='btnbox'>
                <Button variant="contained" className='btn'
                onClick={()=>{setMode('detail')}}
                >작품구경가기</Button>
                <Button color='info' variant="contained" className='btn'
                  onClick={()=>{setMode('index')}}
                >상점 이동</Button>
              </div>
            </div> 
          </StoreWapper>
        }

        <StoreWapper>
          <IconButton size="small" className="close" onClick={() => dispatch(closeVendingMachineDialogOpen())}>
            <CloseIcon />
          </IconButton>
            {mode==='index'&&
            <div className='nftstore'>
              <div className='Index'>
                <ColorBar>
                  {filter === "all" && (
                    <img className="all" src="essets/images/오로라.jpg" alt="bg" />
                  )}
                  {filter === "art" && (
                    <img className="art" src="essets/images/art.jpg" alt="bg" />
                  )}
                  {filter === "music" && (
                    <img className="music" src="essets/images/music.jpg" alt="bg" />
                  )}
                  {filter === "photography" && (
                    <img className="photography" src="essets/images/photography2.jpg" alt="bg" />
                  )}
                  {filter === "sports" && (
                    <img className="sports" src="essets/images/sports.jpg" alt="bg" />
                  )}
                  {filter === "game" && (
                    <img className="game" src="essets/images/game.jpg" alt="bg" />
                  )}
              </ColorBar> 
              <CategoryBar>
                  <li>
                    <p id={filter === "all" ? "category" : ""}
                      onClick={() => {setFilter("all");}}
                      > All </p>
                  </li>
                  <li>
                    <p id={filter === "art" ? "category" : ""}
                      onClick={() => {setFilter("art");}}
                    > Art</p>
                  </li>
                  <li>
                    <p id={filter === "music" ? "category" : ""}
                      onClick={() => { setFilter("music");}}
                    > Music</p>
                  </li>
                  <li>
                    <p id={filter === "photography" ? "category" : ""}
                      onClick={() => {setFilter("photography");}}
                    > Photography</p>
                  </li>
                  <li>
                    <p id={filter === "sports" ? "category" : ""}
                      onClick={() => {setFilter("sports");}}
                    > Sports</p>
                  </li>
                  <li>
                    <p id={filter === "game" ? "category" : ""}
                      onClick={() => {setFilter("game");}}
                    > Game </p>
                  </li>
                </CategoryBar>
              <ItemCards>
                {items.map((item,idx) => {
                  return <SmallItemCard setMode={setMode} key={idx} item={item} />;
                })}
              </ItemCards>
            </div>
            </div>
          }
          {mode==='detail'&&
            <div className='Detail'>
              <KeyboardReturnIcon style={{cursor: 'pointer'}} onClick={()=>{setMode('index')}} />
              <GameDetailItem setMode={setMode}/>
            </div>
          }
      </StoreWapper>
    </ModalWrapper>
      
  )
}

export default VendingMachineDialog