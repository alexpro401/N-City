import { Button, Input, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery } from 'react-query';
import { getPastHistory, postAuctionBid, postPurchase } from '../../store/apis/deal';
import { createSaleContract, NFTcreatorContract, SaleFactoryContract, SSFTokenContract } from '../../web3Config';
import { Event } from '../Mypage/Mypage';
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';
import IsLoading2 from './IsLoading2';

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 800px;
  height: 560px;
  border-radius: 10px;
  .title {
    color: #35357a;
    text-align: center;
    font-size:5vh;
    width: 80%;
    border-bottom: 2px solid #35357a;
    margin: auto;
    margin-top: 2vh;
  }
`;
const Exit = styled.div`
  position: absolute;
  right:20px;
  top:20px;
  cursor: pointer;
`

const Title = styled.h1`
  margin: 40px 0 10px;
  font-size: 30px;
  text-align: center;
`;

const Divider = styled.hr`
  border: solid 1px #35357a;
  width: 65%;
  margin-bottom: 20px;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px auto 20px;
  button {
    font-family: "Noto Sans KR", sans-serif;
    /* position: absolute; */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #6225E6;
    color: #fff;
    font-weight: 500;
    font-size: 25px;
    padding: 10px 0;
    width: 300px;
    height: 50px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    &:hover {
      background-color: rgb(86, 43, 177);
      box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    }
  }
`;

const ContentBox = styled.div`
  display: flex;
  justify-content: center;
  .left {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    img {
      max-width: 90%;
      max-height: 90%;
    }
  }
  .right {
    width: 320px;
    height: 300px;
    display: flex;
    flex-direction: column;
    margin: 0 10px;
  }
`

const Content = styled.div`
  margin-top: 10px;
  font-weight: 500;
  .itemname {
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .date {
    text-align: center;
  }
  .price{
    font-size: 18px;
    margin-left: 5px;
    span {
      color: #6225e6;
    }
  }
  .buttonbox {
    display: flex;
    justify-content: center;
    button {

    }
  }
  .desc {
    width: 300px;
    height: 120px;
    background-color: #f3f2f2;
    overflow-y: auto;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
  }
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin: 0;
    }
  }
  input {
    margin: 10px 10px 0 0;
    background-color: #edecec;
    height: 20px;
    border-radius: 10px;
    padding: 5px;
    outline: none;
    font-size: 15px;
    :focus {
      outline: none;
    }
  }
  #true{
    background-color: #def3bf;
  }
  #false{
    background-color: #f8ced5;
  }
`


interface Iprops{
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  status:string,
  item:{
    productId: Number,
    userId: Number,
    productTitle: string,
    productDesc: string,
    productCode: Number,
    productXCoordinate: Number,
    productYCoordinate: Number,
    productView: Boolean,
    productState: Number,
    productPrice: Number,
    productRegDt: string,
    productFileUrl: string,
    productThumbnailUrl: string,
    favoriteCount: Number
  }, // ??????, ?????? ??????, ?????? ??????.. 
}

interface Istate {
  item: {
    productId: number;
    userId: number;
    tokenId: number;
    productTitle: string;
    productDesc: string;
    productCode: number;
    productXCoordinate: number;
    productYCoordinate: number;
    productView: boolean;
    productState: number;
    productPrice: number;
    productRegDt: string;
    productFileUrl: string;
    productThumbnailUrl: string;
    productAuctionEndTime: string;
    favoriteCount: number;
  };
  
}

const GameDealModal:React.FC<Iprops> = ({item,open,setOpen,status}) => {
  const handleClose = () => setOpen(false);
  const [localitem,setLocalitem] = useState<any>(item)
  const [priceValue,setPriceValue] = useState('')
  const [check,setCheck] = useState('')
  const [price,setPrice] = useState(Number(item.productPrice))
  const [afterBuy,setAfterBuy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {ethereum} = window


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue(e.target.value);
    
  }; // ????????? ??????



  const postgetBid = useMutation<any, Error>(
    "postAuctionBid",
    async () => {
      return await postAuctionBid(Number(priceValue), Number(item.productId));
    },
    {
      onSuccess: (res) => {
        
        setAfterBuy(true);
        setPrice(Number(priceValue));
        setPriceValue("")
        setIsLoading(false)
        window.location.reload()
      },
      onError: (err: any) => {
        setIsLoading(false)
        
      },
    }
  );

  const postgetBuy = useMutation<any, Error>(
    "postPurchase",
    async () => {
      return await postPurchase(Number(item.productId));
    },
    {
      onSuccess: (res) => {
        setAfterBuy(true) // ????????? ????????? ?????? ??????
        setIsLoading(false)
        
        window.location.reload()
      },
      onError: (err: any) => {
        setIsLoading(false)
      
      },
    }
  );

  const isOkay = ()=>{
    if(Number(priceValue)-price>=1){setCheck('true')} 
    else if (priceValue===''){setCheck('null')}
    else {setCheck('false')}
  }

  useEffect(()=>{
    setAfterBuy(false)
    isOkay()
  },[priceValue])

  const getBid = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (!accounts) {
        alert("????????? ??????????????????")
        return
      }

      // sale???????????? ?????? ????????? ??????
      setIsLoading(true)
      const response = await SaleFactoryContract.methods
      .getSaleContractAddress(localitem.tokenId)
      .call();
      const saleContract = await createSaleContract(response)
      
      // sale??????????????? erc20?????? ???????????? ??????
      await SSFTokenContract.methods
      .approve(response, Number(priceValue))
      .send({ from: accounts[0] });

      // bid ??????
      const response2 = await saleContract.methods.bid(Number(priceValue)).send({ from: accounts[0] });
      const bidder = (response2.events.HighestBidIncereased.returnValues.bidder);
      const amount = (response2.events.HighestBidIncereased.returnValues.amount);
      postgetBid.mutate()
    } catch (error) {
      setIsLoading(false)
      return
    }
  }
  const getBuy = async () => {
    
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (!accounts) {
        alert("????????? ??????????????????")
        return
      }
      
     
      setIsLoading(true)
      // sale???????????? ?????? ????????? ??????
      const response = await SaleFactoryContract.methods
      .getSaleContractAddress(localitem.tokenId)
      .call();
      
      const saleContract = await createSaleContract(response)
      
      // sale??????????????? erc20?????? ???????????? ??????
      await SSFTokenContract.methods
      .approve(response, price)
      .send({ from: accounts[0] });

      //purchase ??????
      const response2 = await saleContract.methods.purchase(price).send({ from: accounts[0] });
      const winner = (response2.events.SaleEnded.returnValues.winner);
      const amount = (response2.events.SaleEnded.returnValues.amount);
      postgetBuy.mutate()
    } catch (error) {
      
      setIsLoading(false)
      return
    }
  }

  const getTitle = () => {
    switch (status) {
      case "sell":
        return "Purchase"
      case "bid":
        return "Bid"
      default:
        return ""
    }
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Wrapper>
        <Title>{getTitle()}</Title>
        <Divider />
        <Exit>
          <CloseIcon
            fontSize="small"
            onClick={() => {
              setOpen(false);
            }}
          />
        </Exit>
        <ContentBox>
          <div className="left">
            <img src={item.productThumbnailUrl} alt="pic" />
          </div>
          <div className="right">
            {status === "bid" &&
              (isLoading ? (
                <Content>
                  <div className="loading">
                    <img alt="dk" src="https://i.gifer.com/Xqg8.gif" />
                    <p>????????? ?????????...</p>
                    <p>????????? ??????????????????</p>
                  </div>
                </Content>
              ) : (
                <Content>
                  <div className="itemname">{item.productTitle}</div>
                  <div className="date">
                    ?????? ????????? : {item.productRegDt.replaceAll("-", "/")}
                  </div>
                  <div className="desc">{item.productDesc}</div>
                  <div className="price">
                    ?????? ?????? ??????????????? : <span>{price}</span> NCT
                  </div>
                  <div className="price">
                    ?????? {price + 1}NCT ????????? ???????????? ???????????????
                  </div>
                  <div>
                    <input
                      id={
                        check === "true"
                          ? "true"
                          : check === "false"
                          ? "false"
                          : "null"
                      }
                      value={priceValue}
                      onChange={handleChange}
                    />
                    NCT
                  </div>
                  {check === "true" && (
                    <div>
                      <ButtonBox>
                        <Button
                          onClick={() => {
                            getBid();
                          }}
                          variant="contained"
                        >
                          ????????????
                        </Button>
                      </ButtonBox>
                    </div>
                  )}
                </Content>
              ))}
            {status === "sell" &&
              (isLoading ? (
                <Content>
                  <div className="loading">
                    <img alt="dk" src="https://i.gifer.com/Xqg8.gif" />
                    <p>?????? ?????????...</p>
                    <p>????????? ??????????????????</p>
                  </div>
                </Content>
              ) : (
                <Content>
                  <div className="itemname">{item.productTitle}</div>
                  <div className="date">
                    ?????? ????????? : {item.productRegDt.replaceAll("-", "/")}
                  </div>
                  <div className="desc">{item.productDesc}</div>
                  <div className="price">
                    ?????? ????????? : <span>{price}</span>NCT
                  </div>
                  <ButtonBox>
                    <Button
                      onClick={() => {
                        getBuy();
                      }}
                      variant="contained"
                    >
                      ????????????
                    </Button>
                  </ButtonBox>
                </Content>
              ))}
          </div>
        </ContentBox>
      </Wrapper>
    </Modal>
  );
}

export default GameDealModal