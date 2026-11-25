import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { POPULAR_LANGUAGES } from './ProfileSetup';
import ProfileScreen, { AvatarImage } from './ProfileScreen';

const ink = '#112d33', teal = '#008e85';
const icons = {
  Translate: 'M3 10.5 12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z',
  Conversation: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z',
  Phrases: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-2H2V3ZM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-2h7V3Z',
  Profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  Bell: 'M4 17h16l-2-4V9a6 6 0 0 0-12 0v4Z M10 20q2 3 4 0',
  Swap: 'M20 8H4m0 0l4-4M4 8l4 4m12 8H4m16 0l-4-4m4 4l-4 4',
  Mic: 'M12 2a3.5 3.5 0 0 0-3.5 3.5v5a3.5 3.5 0 0 0 7 0v-5A3.5 3.5 0 0 0 12 2ZM18 10.5v.5a6 6 0 0 1-12 0v-.5M12 17v4M8 21h8',
};

function Icon({ name, size = 22, color = teal }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d={icons[name]} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const tabs = ['Translate', 'Conversation', 'Phrases', 'Profile'];

function Button({ children, style, onPress, label }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [style, pressed && { opacity: 0.74 }]}>
      {children}
    </Pressable>
  );
}

export default function TranslatorHome({ profile }) {
  const inset = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Platform.OS === 'web' ? Math.min(432, width) : width;

  const scale = Math.min(1.22, Math.max(0.95, w / 360));
  const sHeadline = Math.round(28 * scale);
  const sLineHeight = Math.round(33 * scale);
  const sBrand = Math.round(26 * scale);
  const sLogo = Math.round(48 * scale);
  const sPillH = Math.round(44 * scale);
  const sPillFont = Math.round(13.5 * scale);
  const sPillFlag = Math.round(18 * scale);
  const sNavIcon = Math.round(20 * scale);
  const sNavText = Math.round(11 * scale);

  const [currentProfile, setCurrentProfile] = useState(
    profile || {
      firstName: 'Emma',
      lastName: 'Carter',
      fullName: 'Emma Carter',
      language: { code: 'en', name: 'English', flag: '🇺🇸' },
      country: { code: 'IN', name: 'India', flag: '🇮🇳' },
      avatarUri: profile?.avatarUri || null,
    }
  );
  const [activeTab, setActiveTab] = useState('Translate');
  const [currentProfileScreen, setCurrentProfileScreen] = useState('main');
  const [source, setSource] = useState(profile?.language || POPULAR_LANGUAGES[0]);
  const [target, setTarget] = useState(source.code === 'ja' ? POPULAR_LANGUAGES[0] : POPULAR_LANGUAGES[1]);
  const [panel, setPanel] = useState('');

  const open = name => setPanel(name);
  const swap = () => {
    setSource(target);
    setTarget(source);
  };

  const choose = lang => {
    if (panel === 'I speak') {
      if (lang.code === target.code) setTarget(source);
      setSource(lang);
    } else {
      if (lang.code === source.code) setSource(target);
      setTarget(lang);
    }
    setPanel('');
  };

  if (activeTab === 'Profile') {
    return (
      <View style={s.outer}>
        <ProfileScreen
          profile={currentProfile}
          onUpdateProfile={updated => {
            setCurrentProfile(updated);
            if (updated.language) setSource(updated.language);
          }}
          onBack={() => {
            setCurrentProfileScreen('main');
            setActiveTab('Translate');
          }}
          onScreenChange={setCurrentProfileScreen}
          scale={scale}
        />
        {currentProfileScreen === 'main' && (
          <View style={[s.bottomNav, { width: w, paddingBottom: Math.max(10, inset.bottom), paddingTop: Math.round(8 * scale) }]}>
            {tabs.map(name => {
              const isActive = activeTab === name;
              return (
                <Button
                  key={name}
                  onPress={() => {
                    if (name === 'Profile') setActiveTab('Profile');
                    else if (name === 'Translate') setActiveTab('Translate');
                    else open(name);
                  }}
                  style={[s.navTab, isActive && s.navTabActive, { paddingVertical: Math.round(6 * scale) }]}
                >
                  <Icon name={name} size={sNavIcon} color={isActive ? teal : '#628087'} />
                  <Text style={[s.navLabel, isActive && s.navLabelActive, { fontSize: sNavText }]}>{name}</Text>
                </Button>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={s.outer}>
      <LinearGradient colors={['#e3f8f7', '#f4fcfb', '#caf2f0']} style={{ width: w, flex: 1, paddingTop: inset.top }}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[s.content, { paddingHorizontal: Math.round(16 * scale), paddingTop: Math.round(8 * scale) }]} showsVerticalScrollIndicator={false}>
            <View style={{ gap: Math.round(10 * scale) }}>
              {/* Header */}
              <View style={s.header}>
                <Image source={require('./assets/onboarding/bubble.png')} style={{ width: sLogo, height: sLogo }} />
                <Text style={[s.brand, { fontSize: sBrand, lineHeight: Math.round(sBrand * 1.15) }]}>Bubble</Text>
                <View style={s.badge}><View style={s.dot} /><Text style={[s.badgeText, { fontSize: Math.round(10 * scale) }]}>Local preview</Text></View>
                <Button label="Notifications" onPress={() => open('Notifications')} style={[s.iconButton, { width: Math.round(38 * scale), height: Math.round(42 * scale) }]}>
                  <Icon name="Bell" color={ink} size={Math.round(21 * scale)} />
                </Button>
                <Button
                  label="Open profile"
                  onPress={() => {
                    setCurrentProfileScreen('main');
                    setActiveTab('Profile');
                  }}
                  style={[
                    s.avatar,
                    {
                      width: Math.round(34 * scale),
                      height: Math.round(34 * scale),
                      borderRadius: Math.round(17 * scale),
                      overflow: 'hidden',
                      borderWidth: 1.5,
                      borderColor: '#ffffff',
                    },
                  ]}
                >
                  <AvatarImage uri={currentProfile?.avatarUri} size={Math.round(34 * scale)} scale={scale} />
                </Button>
              </View>

              {/* Hero Banner */}
              <View style={[s.hero, { minHeight: Math.round(116 * scale) }]}>
                <Image pointerEvents="none" resizeMode="contain" source={require('./assets/onboarding/mainbg.png')} style={s.mountain} />
                <View style={[s.heroTextWrap, { transform: [{ translateY: Math.round(-12 * scale) }] }]}>
                  <Text numberOfLines={1} style={[s.headlineTop, { fontSize: sHeadline, lineHeight: sLineHeight }]}>Talk to the world,</Text>
                  <Text numberOfLines={1} style={[s.headlineBottom, { fontSize: sHeadline, lineHeight: sLineHeight }]}>without limits.</Text>
                </View>
              </View>

              {/* Language Selection Card */}
              <View style={[s.card, s.selectorsCard]}>
                <View style={s.selectorCol}>
                  <Text style={[s.selectorLabel, { fontSize: Math.round(11 * scale) }]}>From</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`From, ${source.name}`}
                    onPress={() => open('I speak')}
                    style={({ pressed }) => [s.selectorPill, { height: sPillH }, pressed && s.selectorPillActive]}
                  >
                    <Text style={[s.selectorFlag, { fontSize: sPillFlag }]}>{source.flag}</Text>
                    <Text numberOfLines={1} style={[s.selectorText, { fontSize: sPillFont }]}>{source.name}</Text>
                    <Text style={[s.selectorChevron, { fontSize: Math.round(14 * scale) }]}>⌄</Text>
                  </Pressable>
                </View>

                {/* Swap Button */}
                <Pressable onPress={swap} style={s.swapBtn}>
                  <Icon name="Swap" size={20} color="#ffffff" />
                </Pressable>

                <View style={s.selectorCol}>
                  <Text style={[s.selectorLabel, { fontSize: Math.round(11 * scale) }]}>To</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`To, ${target.name}`}
                    onPress={() => open('Translate to')}
                    style={({ pressed }) => [s.selectorPill, { height: sPillH }, pressed && s.selectorPillActive]}
                  >
                    <Text style={[s.selectorFlag, { fontSize: sPillFlag }]}>{target.flag}</Text>
                    <Text numberOfLines={1} style={[s.selectorText, { fontSize: sPillFont }]}>{target.name}</Text>
                    <Text style={[s.selectorChevron, { fontSize: Math.round(14 * scale) }]}>⌄</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Mic Action Section */}
            <View style={s.micArea}>
              <Pressable style={s.basicMicBtn}>
                <Icon name="Mic" size={32} color="#ffffff" />
              </Pressable>
              <Text style={s.micTitle}>Tap to speak</Text>
              <Text style={s.caption}>Translate into {target.name}</Text>
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={[s.bottomNav, { paddingBottom: Math.max(10, inset.bottom), paddingTop: Math.round(8 * scale) }]}>
            {tabs.map(name => {
              const isActive = activeTab === name;
              return (
                <Button
                  key={name}
                  onPress={() => {
                    if (name === 'Profile') setActiveTab('Profile');
                    else if (name === 'Translate') setActiveTab('Translate');
                    else open(name);
                  }}
                  style={[s.navTab, isActive && s.navTabActive, { paddingVertical: Math.round(6 * scale) }]}
                >
                  <Icon name={name} size={sNavIcon} color={isActive ? teal : '#628087'} />
                  <Text style={[s.navLabel, isActive && s.navLabelActive, { fontSize: sNavText }]}>{name}</Text>
                </Button>
              );
            })}
          </View>
        </View>

        {/* Language Selection Modal */}
        <Modal visible={!!panel} transparent animationType="fade" onRequestClose={() => setPanel('')}>
          <View style={s.overlay}>
            <Pressable accessibilityLabel="Dismiss" onPress={() => setPanel('')} style={StyleSheet.absoluteFill} />
            <View style={[s.sheet, { width: w, paddingBottom: Math.max(22, inset.bottom) }]}>
              <View style={s.row}>
                <Text style={s.sheetTitle}>{panel}</Text>
                <Button label="Close" onPress={() => setPanel('')} style={s.iconButton}>
                  <Text style={{ fontSize: 24 }}>×</Text>
                </Button>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                {['I speak', 'Translate to'].includes(panel) &&
                  POPULAR_LANGUAGES.map(lang => (
                    <Button key={lang.code} onPress={() => choose(lang)} style={s.item}>
                      <Text style={s.line}>{lang.flag}   {lang.name}</Text>
                    </Button>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  outer: { flex: 1, alignItems: 'center', backgroundColor: '#d9eeee' },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, flexGrow: 1, justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 2 },
  brand: { fontSize: 26, lineHeight: 30, letterSpacing: -1.2, fontWeight: '800', color: ink, flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: '#e6faf0', borderRadius: 16, borderWidth: 1, borderColor: '#bce5d0' },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#389668' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#317b59' },
  iconButton: { width: 38, height: 42, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#155952', alignItems: 'center', justifyContent: 'center' },
  hero: { minHeight: 116, justifyContent: 'center', paddingVertical: 8, position: 'relative' },
  heroTextWrap: { maxWidth: '75%', zIndex: 1, justifyContent: 'center' },
  mountain: { position: 'absolute', right: -16, width: '76%', height: '125%', bottom: -4 },
  headlineTop: { fontSize: 28, lineHeight: 33, color: ink, fontWeight: '800', letterSpacing: -1.1 },
  headlineBottom: { fontSize: 28, lineHeight: 33, color: teal, fontWeight: '800', letterSpacing: -1.1 },
  card: { borderRadius: 28, backgroundColor: 'rgba(255,255,255,.94)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,.95)' },
  selectorsCard: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 14, shadowColor: '#0a3d38', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 6 },
  selectorCol: { flex: 1, gap: 5 },
  selectorLabel: { fontSize: 11, fontWeight: '700', color: '#68888e', paddingLeft: 6, letterSpacing: 0.3 },
  selectorPill: { flexDirection: 'row', height: 44, paddingHorizontal: 12, alignItems: 'center', borderRadius: 22, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e1f2ef', shadowColor: '#0a3c39', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  selectorPillActive: { backgroundColor: '#f0fcfb', borderColor: '#78dfd4' },
  selectorFlag: { fontSize: 18, marginRight: 7 },
  selectorText: { flex: 1, fontSize: 13.5, fontWeight: '700', color: ink },
  selectorChevron: { fontSize: 14, color: '#45666b', fontWeight: '700', marginLeft: 2 },
  swapBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: teal, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  micArea: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  basicMicBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: teal, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  micTitle: { fontSize: 20, fontWeight: '800', color: ink, marginTop: 8 },
  caption: { fontSize: 13, fontWeight: '500', color: '#5f8086' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#ffffff', paddingHorizontal: 12, paddingTop: 10, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: '#e0f1ee', shadowColor: '#0a3c39', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
  navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: 20 },
  navTabActive: { backgroundColor: '#d8f6f2' },
  navLabel: { fontSize: 11, fontWeight: '600', color: '#628087' },
  navLabelActive: { color: teal, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(14,49,52,.32)', alignItems: 'center', justifyContent: 'flex-end' },
  sheet: { maxHeight: '75%', backgroundColor: '#f6fcfb', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  sheetTitle: { flex: 1, fontSize: 22, fontWeight: '700', color: ink },
  item: { paddingVertical: 13, gap: 3, borderBottomWidth: 1, borderColor: '#d8ebe8' },
  line: { fontSize: 15, color: ink, fontWeight: '600' },
});
