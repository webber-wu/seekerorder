import React, { useEffect, useState } from 'react';
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
  const [orderNote, setOrderNote] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const toggleCheck = () => {
    setIsCheck(!isCheck);
  };

  const buylist = data.map((item, index) => {
    if (item.商品名稱 !== '費用') {
      return <OrderItem key={index} data={item} />;
    }
  });

  const setOldCustomer = () => {
    setIsOlder(!isOlder);
  };

  return (
    <>
      <div className={`order ${isCheck ? 'is-check' : ''}`}>
        <div className="content">
          <div className={`info ${isOlder ? 'is-older' : ''}`}>
            <div className="name" onClick={setOldCustomer}>
              {/* <span>{data[0].顧客性別 === '先生' ? '🙋‍♂️' : '🙋‍♀️'}</span> */}
              {data[0].訂購人}{' '}
              {
                <span>
                  {data[0].顧客資料備註 === 'VIP會員' ? '⭐️VIP⭐️' : ''}
                </span>
              }
            </div>
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

        <div className="list">
          <ol>{buylist}</ol>
        </div>

        <div className="comment customer">
          <p>顧客備註：</p>
          <textarea
            disabled
            defaultValue={data[0].hasOwnProperty('備註') ? data[0].備註 : '無'}
          />
        </div>

        <div className="comment">
          <p>商家備註：</p>
          <textarea defaultValue="小豆" />
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
    const family = [];
    const postoffice = [];
    const takeit = [];
    const orders = await getAllOrdersNum(data);
    // console.log(orders);
    setAllOrder(orders);
    orders.forEach((order) => {
      const orderArray = getSameOrderArray(data, order);
      console.log(orderArray);
      if (orderArray[0].出貨方式.indexOf('港澳') >= 0) {
        hongkong.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('7-11') >= 0) {
        sevenElevent.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('全家') >= 0) {
        family.push(orderArray);
      } else if (orderArray[0].出貨方式.indexOf('中華郵政') >= 0) {
        postoffice.push(orderArray);
      } else {
        takeit.push(orderArray);
      }
    });
    setSevenElevenOrder(sevenElevent);
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
        console.log(data);
        setReady(true);
        // data.pop();
        dataProcess(data);
      } catch (e) {
        // 這裡可以丟擲檔案型別錯誤不正確的相關提示
        console.log('檔案型別不正確');
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
        familyOrderNum={familyOrder.length}
        postOrderNum={postOrder.length}
        hongKongOrderNum={hongKongOrder.length}
        takeItOrderNum={takeItOrder.length}
      />
    </>
  );
}

export default Home;
