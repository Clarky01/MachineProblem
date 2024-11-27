export const preprocessData = (data) => {
    const months = [];
    const products = new Set();
    const quantities = [];
  
    data.forEach((row) => {
      const date = new Date(`${row.sales_date}-01`);
      months.push(date.getMonth() + 1);
      products.add(row.product_description);
      quantities.push(parseInt(row.quantity_sold, 10));
    });
  
    const productMapping = Array.from(products).reduce((acc, product, index) => {
      acc[product] = index;
      return acc;
    }, {});
  
    const processedData = data.map((row) => ({
      sales_date: new Date(`${row.sales_date}-01`).getMonth() + 1,
      product_description: productMapping[row.product_description],
      quantity_sold: parseInt(row.quantity_sold, 10),
    }));
  
    const normalizedQuantities = normalize(quantities);
  
    return { processedData, productMapping, normalizedQuantities };
  };
  
  const normalize = (data) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map((val) => (val - min) / (max - min));
  };
  