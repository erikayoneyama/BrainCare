// src/screens/Home.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Configuracoes() {
  return (
    <View style={styles.container}>
      <Text>Conf</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});