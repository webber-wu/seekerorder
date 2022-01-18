import React from 'react';

const Summary = ({
  ready,
  onImportExcel,
  allOrderNum,
  sevenOrderNum,
  blackCatOrderNum,
  familyOrderNum,
  postOrderNum,
  hongKongOrderNum,
  takeItOrderNum,
}) => {
  return (
    <div className="summary">
      {ready ? (
        <div className="done">
          <div className="store">
            便利商店：
            <span>{sevenOrderNum + familyOrderNum}</span>筆
          </div>
          <div className="blackcat">
            黑貓宅急便：
            <span>{blackCatOrderNum}</span>筆
          </div>
          <div className="postoffice">
            郵局：<span>{postOrderNum}</span>筆
          </div>
          <div className="takeit">
            自取：
            <span>{takeItOrderNum}</span>筆
          </div>
          <div className="hk">
            港澳：<span>{hongKongOrderNum}</span>筆
          </div>
          <p className="all">
            Total：<span>{allOrderNum}</span>筆
          </p>
        </div>
      ) : (
        <div className="choice">
          <input
            className="inputfile inputfile-1"
            type="file"
            id="file"
            accept=".xlsx, .xls"
            onChange={onImportExcel}
          />
          <label htmlFor="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
            </svg>
            <span>請匯入 Excel 檔</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default Summary;
