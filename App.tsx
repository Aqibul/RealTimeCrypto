import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text, Image} from 'react-native';

const REFRESH_INTERVAL = 60000;

const CoinRow = ({coin}) => (
  <View style={styles.row}>
    <Image source={{uri: coin.image}} style={styles.image} />
    <View style={styles.column}>
      <Text style={styles.name}>{coin.name}</Text>
      <Text style={styles.symbol}>{coin.symbol}</Text>
    </View>
    <Text style={styles.price}>{`$${coin.current_price}`}</Text>
    <Text style={styles.athChange}>{`${coin.ath_change_percentage}%`}</Text>
  </View>
);

const ErrorBanner = ({error}) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

const RealTimePriceTicker = ({coin}) => (
  <View style={styles.ticker}>
    <Text
      style={
        styles.tickerText
      }>{`${coin.symbol} Price: $${coin.current_price}`}</Text>
  </View>
);

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/markets';
      const params = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      };

      const response = await fetch(`${url}?${new URLSearchParams(params)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ScrollView>
      {error && <ErrorBanner error={error} />}

      {data.map(item => (
        <CoinRow key={item.id} coin={item} />
      ))}

      {data.length > 0 && <RealTimePriceTicker coin={data[0]} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  athChange: {
    fontSize: 16,
    color: 'green',
  },
  ticker: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
  },
  tickerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
