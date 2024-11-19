const Table = ({ data, columns }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column, index) => ( 
              <th key={index} className="border-b bg-gray-300 p-2 text-center"
              style={{ width: column.width || "auto" }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border-b border-gray-300 p-2 text-center">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
