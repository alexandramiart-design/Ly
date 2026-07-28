import React, {useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import ImageScreen from './src/screens/ImageScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Tab = 'chat' | 'image' | 'settings';

function App(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>('chat');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0f" />
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          {tab === 'chat' && <ChatScreen />}
          {tab === 'image' && <ImageScreen />}
          {tab === 'settings' && <SettingsScreen />}
        </View>
        <SafeAreaView edges={['bottom']} style={styles.tabBarWrap}>
          <View style={styles.tabBar}>
            <TabBtn
              label="Chat"
              active={tab === 'chat'}
              onPress={() => setTab('chat')}
              testID="tab-chat"
            />
            <TabBtn
              label="Image"
              active={tab === 'image'}
              onPress={() => setTab('image')}
              testID="tab-image"
            />
            <TabBtn
              label="Réglages"
              active={tab === 'settings'}
              onPress={() => setTab('settings')}
              testID="tab-settings"
            />
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabBtn({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#0d0d0f'},
  content: {flex: 1},
  tabBarWrap: {backgroundColor: '#0d0d0f'},
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2e',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c20',
  },
  tabBtnActive: {backgroundColor: '#c98d5c'},
  tabTxt: {color: '#a9a9b3', fontSize: 13, fontWeight: '600'},
  tabTxtActive: {color: '#1a1a1c'},
});

export default App;
