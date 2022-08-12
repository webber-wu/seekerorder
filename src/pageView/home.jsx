import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useDispatch } from 'redux-react-hook';
import { initials } from '../redux/action/uiAction';

import Summary from '../component/summary';

const OrderItem = ({ data }) => {
  const [isShortage, setIsShortage] = useState(false);

  const toggleShortage = () => {
    setIsShortage(!isShortage);
  };

  return (
    <li
      className={`${isShortage ? 'is-shortage' : ''}`}
      onClick={toggleShortage}
    >
      {data.商品名稱} <b>{data.商品款式}</b>{' '}
      <span className={`${data.數量 > 1 ? 'important' : ''}`}>{data.數量}</span>
    </li>
  );
};

const OrderBlock = ({ data }) => {
  const [isCheck, setIsCheck] = useState(false);
  const [isOlder, setIsOlder] = useState(false);
  // const [orderNote, setOrderNote] = useState('');
  // const [customerNote, setCustomerNote] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef();

  const toggleCheck = () => {
    setIsCheck(!isCheck);
  };

  const buylist = data.map((item, index) => {
    if (item.商品名稱 !== '費用') {
      return <OrderItem key={index} data={item} />;
    }
  });

  const copyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setCopySuccess('已複製文字!');

    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };

  const ExcelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const year = date_info.getFullYear();
    const month = date_info.getMonth() + 1;
    const day = date_info.getDate();
    return year + ' / ' + month + ' / ' + day;
    // var fractional_day = serial - Math.floor(serial) + 0.0000001;
    // var total_seconds = Math.floor(86400 * fractional_day);
    // var seconds = total_seconds % 60;
    // total_seconds -= seconds;
    // var hours = Math.floor(total_seconds / (60 * 60));
    // var minutes = Math.floor(total_seconds / 60) % 60;
    // return new Date(
    //   date_info.getFullYear(),
    //   date_info.getMonth(),
    //   date_info.getDate(),
    //   hours,
    //   minutes,
    //   seconds
    // );
  };

  // const timeConverter = (time) => {
  //   console.log(time);
  //   const timeCode = new Date(time * 1000);
  //   const months = [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec',
  //   ];
  //   const year = timeCode.getFullYear();
  //   const month = months[timeCode.getMonth()];
  //   const date = timeCode.getDate();
  //   const formatTime = year + ' / ' + month + ' / ' + date;
  //   console.log(formatTime);
  //   return formatTime;
  // };

  // const setOldCustomer = () => {
  //   setIsOlder(!isOlder);
  // };

  return (
    <>
      <div className={`order ${isCheck ? 'is-check' : ''}`}>
        <div className="content">
          <div className={`info ${isOlder ? 'is-older' : ''}`}>
            {data[0].hasOwnProperty('會員標籤') ? (
              <div className="tag">
                <b>{`${data[0].會員標籤}`}</b>
                <span>
                  {data[0].會員資料備註 === 'VIP會員' ? '⭐️VIP⭐️' : ''}
                </span>
              </div>
            ) : null}
          </div>
          <div className="checker">
            <input
              id={data[0].訂單編號}
              type="checkbox"
              onClick={toggleCheck}
            />
            <label htmlFor={data[0].訂單編號}></label>
          </div>
        </div>
        <div className="name">
          {/* <span>{data[0].顧客性別 === '先生' ? '🙋‍♂️' : '🙋‍♀️'}</span> */}
          {/* <span>訂購人：{data[0].購買人名稱}</span> */}
          收貨人：{data[0].收件人名稱}
          <span>
            ( 生日：
            {data[0].hasOwnProperty('會員生日')
              ? ExcelDateToJSDate(data[0].會員生日) + ' '
              : '無填寫'}
            )
          </span>
        </div>
        <hr />
        <div className="list">
          <ol>{buylist}</ol>
        </div>
        <hr />
        <div className="coupon">
          <p>優惠券名稱：</p>
          <p>
            <span>
              {data[0].hasOwnProperty('優惠券名稱') ? data[0].優惠券名稱 : '無'}
            </span>
          </p>
        </div>

        <div className="comment customer">
          <p>顧客備註：</p>
          <textarea
            disabled
            defaultValue={data[0].hasOwnProperty('備註') ? data[0].備註 : '無'}
          />
        </div>

        <div className="comment">
          <button onClick={copyToClipboard}>複製文字</button>
          <p>商家備註：{copySuccess}</p>
          <textarea defaultValue="小豆" ref={textAreaRef} />
        </div>
      </div>
    </>
  );
};

const Order = ({ array }) => {
  const list = array.map((block, index) => {
    return <OrderBlock data={block} key={index} />;
  });

  return list;
};

function Home() {
  const dispatch = useDispatch();
  // const [table, setTable] = useState([]);
  // const [taiwanOrder, setTaiwanOrder] = useState([]);
  const [ready, setReady] = useState(false);
  const [allOrder, setAllOrder] = useState([]);
  const [sevenElevenOrder, setSevenElevenOrder] = useState([]);
  const [blackCatOrder, setBlackCatOrder] = useState([]);
  const [familyOrder, setFamilyOrder] = useState([]);
  const [postOrder, setPostOrder] = useState([]);
  const [hongKongOrder, setHongKongOrder] = useState([]);
  const [takeItOrder, setTakeItOrder] = useState([]);

  const getAllOrdersNum = (data) => {
    let result = {};
    data.forEach((item) => {
      result[item.訂單編號] = result[item.訂單編號]
        ? result[item.訂單編號] + 1
        : 1;
    });
    const orders = Object.keys(result);
    // orders.pop(); // 移除最後一筆欄位
    return orders;
  };

  const getSameOrderArray = (data, orderNum) => {
    // console.log(data, orderNum);
    const result = data.filter((row, index, array) => {
      // console.log(row.訂單編號, orderNum, row.訂單編號 === orderNum);
      return row.訂單編號 == orderNum;
    });

    return result;
  };

  const dataProcess = async (data) => {
    const hongkong = [];
    const sevenElevent = [];
    const blackCat = [];
    const family = [];
    const postoffice = [];
    const takeit = [];
    const orders = await getAllOrdersNum(data);
    // console.log(orders);
    setAllOrder(orders);
    orders.forEach((order) => {
      const orderArray = getSameOrderArray(data, order);
      // console.log(orderArray);
      if (orderArray[0].出貨方式.indexOf('港澳') >= 0) {
        hongkong.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('7-11') >= 0) {
        sevenElevent.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('黑貓宅急便') >= 0) {
        blackCat.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('全家') >= 0) {
        family.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('中華郵政') >= 0) {
        postoffice.push(orderArray);
      } else {
        takeit.push(orderArray);
      }
    });
    setSevenElevenOrder(sevenElevent);
    setBlackCatOrder(blackCat);
    setFamilyOrder(family);
    setPostOrder(postoffice);
    setHongKongOrder(hongkong);
    setTakeItOrder(takeit);
  };

  const onImportExcel = (file) => {
    // 獲取上傳的檔案物件
    const { files } = file.target;
    // 通過FileReader物件讀取檔案
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二進位制流方式讀取得到整份excel表格物件
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 儲存獲取到的資料
        // 遍歷每張工作表進行讀取（這裡預設只讀取第一張表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法將 excel 轉成 json 資料
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            break; // 如果只取第一張表，就取消註釋這行
          }
        }
        // console.log(data);
        setReady(true);
        // data.pop();
        dataProcess(data);
      } catch (e) {
        // 這裡可以丟擲檔案型別錯誤不正確的相關提示
        console.log('檔案型別不正確');
        alert('檔案類型不正確');
        return;
      }
    };
    // 以二進位制方式開啟檔案
    fileReader.readAsBinaryString(files[0]);
  };

  useEffect(() => {
    dispatch(initials());
  }, []);
  return (
    <>
      {ready ? (
        <div className="container">
          <div className="taiwan">
            <h1>台灣</h1>
            {sevenElevenOrder.length > 0 ? (
              <div className="block">
                <div className="title">
                  7-11：<span>{sevenElevenOrder.length} 筆</span>
                </div>
                <Order array={sevenElevenOrder} />
              </div>
            ) : null}

            {blackCatOrder.length > 0 ? (
              <div className="block">
                <div className="title">
                  黑貓宅急便：<span>{blackCatOrder.length} 筆</span>
                </div>
                <Order array={blackCatOrder} />
              </div>
            ) : null}

            {familyOrder.length > 0 ? (
              <div className="block">
                <div className="title">
                  全家便利商店：<span>{familyOrder.length} 筆</span>
                </div>
                <Order array={familyOrder} />
              </div>
            ) : null}

            {postOrder.length > 0 ? (
              <div className="block">
                <div className="title">
                  郵局：<span>{postOrder.length} 筆</span>
                </div>
                <Order array={postOrder} />
              </div>
            ) : null}

            {takeItOrder.length > 0 ? (
              <div className="block">
                <div className="title">
                  到店取貨：<span>{takeItOrder.length} 筆</span>
                </div>
                <Order array={takeItOrder} />
              </div>
            ) : null}
          </div>
          <div className="hongkong">
            <h1>香港</h1>
            <div className="block">
              <div className="title">
                順豐：<span>{hongKongOrder.length} 筆</span>
              </div>
              <Order array={hongKongOrder} />
            </div>
          </div>
        </div>
      ) : null}

      <Summary
        onImportExcel={onImportExcel}
        ready={ready}
        allOrderNum={allOrder.length}
        sevenOrderNum={sevenElevenOrder.length}
        blackCatOrderNum={blackCatOrder.length}
        familyOrderNum={familyOrder.length}
        postOrderNum={postOrder.length}
        hongKongOrderNum={hongKongOrder.length}
        takeItOrderNum={takeItOrder.length}
      />
    </>
  );
}

export default Home;
