import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, Easing, Image, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { POPULAR_LANGUAGES } from './ProfileSetup';



const ink = '#112d33';
const teal = '#008b80';
const muted = '#65868c';

// Bilingual travel phrase dictionary for instant live voice translation
const CONVERSATION_DATA = {
  en: {
    greeting: 'Hello, good morning! How are you?',
    directions: 'Excuse me, where is the nearest subway station?',
    shopping: 'How much does this cost? Can I pay by card?',
    food: 'Could I please see the menu? What do you recommend?',
    help: 'Could you please help me? I am a little lost.',
    thanks: 'Thank you very much for your kind help!',
    reply_dir: 'Go straight down this street, then turn right at the corner.',
    reply_shop: 'That is 1,500 yen. Credit cards and mobile pay are accepted.',
    reply_food: 'Here is our menu. The chef special ramen is very popular!',
  },
  ja: {
    greeting: 'こんにちは、おはようございます！お元気ですか？',
    directions: 'すみません、一番近い地下鉄の駅はどこですか？',
    shopping: 'これはいくらですか？カードで支払えますか？',
    food: 'メニューを見せていただけますか？おすすめは何ですか？',
    help: 'すみません、少し道に迷ってしまったので助けていただけますか？',
    thanks: 'ご親切にどうもありがとうございました！',
    reply_dir: 'この道をまっすぐ進んで、角を右に曲がってください。',
    reply_shop: 'それは1,500円です。クレジットカードとスマホ決済が使えます。',
    reply_food: 'こちらがメニューです。シェフ特製ラーメンが一番人気ですよ！',
  },
  es: {
    greeting: '¡Hola, buenos días! ¿Cómo estás?',
    directions: 'Disculpe, ¿dónde está la estación de metro más cercana?',
    shopping: '¿Cuánto cuesta esto? ¿Puedo pagar con tarjeta?',
    food: '¿Me puede traer el menú, por favor? ¿Qué me recomienda?',
    help: '¿Me podría ayudar, por favor? Estoy un poco perdido.',
    thanks: '¡Muchas gracias por su amable ayuda!',
    reply_dir: 'Siga todo recto por esta calle y luego gire a la derecha en la esquina.',
    reply_shop: 'Son 1.500 yenes. Aceptamos tarjeta de crédito y pago móvil.',
    reply_food: 'Aquí tiene el menú. ¡El ramen especial del chef es el más popular!',
  },
  hi: {
    greeting: 'नमस्ते, शुभ प्रभात! आप कैसे हैं?',
    directions: 'माफ़ कीजिए, सबसे नज़दीकी मेट्रो स्टेशन कहाँ है?',
    shopping: 'यह कितने का है? क्या मैं कार्ड से भुगतान कर सकता हूँ?',
    food: 'क्या मुझे मेनू मिल सकता है? आप क्या सुझाव देंगे?',
    help: 'क्या आप मेरी मदद कर सकते हैं? मैं रास्ता भूल गया हूँ।',
    thanks: 'आपकी सहायता के लिए बहुत-बहुत धन्यवाद!',
    reply_dir: 'इस सड़क पर सीधे जाइए, फिर कोने से दाएं मुड़िए।',
    reply_shop: 'यह 1,500 येन है। क्रेडिट कार्ड और मोबाइल पे स्वीकार किए जाते हैं।',
    reply_food: 'यह रहा हमारा मेनू। शेफ स्पेशल रेमन सबसे लोकप्रिय है!',
  },
  fr: {
    greeting: 'Bonjour, bonne journée ! Comment allez-vous ?',
    directions: 'Excusez-moi, où se trouve la station de métro la plus proche ?',
    shopping: 'Combien cela coûte-t-il ? Puis-je payer par carte ?',
    food: 'Puis-je avoir le menu, s’il vous plaît ? Que recommandez-vous ?',
    help: 'Pourriez-vous m’aider, s’il vous plaît ? Je suis un peu perdu.',
    thanks: 'Merci beaucoup pour votre aide précieuse !',
    reply_dir: 'Allez tout droit dans cette rue, puis tournez à droite au coin.',
    reply_shop: 'Cela fait 1 500 yens. Cartes de crédit et paiement mobile acceptés.',
    reply_food: 'Voici notre menu. Les ramen spéciaux du chef sont très populaires !',
  },
  de: {
    greeting: 'Hallo, guten Morgen! Wie geht es Ihnen?',
    directions: 'Entschuldigung, wo ist die nächste U-Bahn-Station?',
    shopping: 'Wie viel kostet das? Kann ich mit Karte bezahlen?',
    food: 'Könnte ich bitte die Speisekarte sehen? Was empfehlen Sie?',
    help: 'Könnten Sie mir bitte helfen? Ich habe mich etwas verlaufen.',
    thanks: 'Vielen Dank für Ihre freundliche Hilfe!',
    reply_dir: 'Gehen Sie diese Straße geradeaus und biegen Sie an der Ecke rechts ab.',
    reply_shop: 'Das macht 1.500 Yen. Kreditkarte und mobiles Zahlen werden akzeptiert.',
    reply_food: 'Hier ist das Menü. Die Spezial-Ramen des Küchenchefs sind sehr beliebt!',
  },
  zh: {
    greeting: '您好，早上好！最近怎么样？',
    directions: '请问最近的地铁站在哪里？',
    shopping: '这个多少钱？可以用信用卡支付吗？',
    food: '可以看一下菜单吗？您有什么推荐？',
    help: '能请您帮帮我吗？我有点迷路了。',
    thanks: '非常感谢您的热情帮助！',
    reply_dir: '顺着这条街一直往前走，然后在街角右转。',
    reply_shop: '一共1500日元，支持信用卡和移动支付。',
    reply_food: '这是我们的菜单，主厨特制拉面最受欢迎！',
  },
  ko: {
    greeting: '안녕하세요, 좋은 아침입니다! 잘 지내시죠?',
    directions: '실례지만, 가장 가까운 지하철역이 어디인가요?',
    shopping: '이거 얼마예요? 카드로 결제할 수 있나요?',
    food: '메뉴판 좀 볼 수 있을까요? 어떤 걸 추천하시나요?',
    help: '죄송하지만 좀 도와주실 수 있나요? 길을 잃었어요.',
    thanks: '친절하게 도와주셔서 정말 감사합니다!',
    reply_dir: '이 길로 곧장 가시다가 모퉁이에서 우회전하세요.',
    reply_shop: '1,500엔입니다. 신용카드와 모바일 결제 가능합니다.',
    reply_food: '여기 메뉴판입니다. 셰프 스페셜 라멘이 가장 인기 있어요!',
  },
  it: {
    greeting: 'Ciao, buongiorno! Come va?',
    directions: 'Mi scusi, dov’è la stazione della metropolitana più vicina?',
    shopping: 'Quanto costa? Posso pagare con carta?',
    food: 'Posso vedere il menu, per favore? Cosa mi consiglia?',
    help: 'Potrebbe aiutarmi, per favore? Mi sono perso.',
    thanks: 'Grazie mille per il vostro gentile aiuto!',
    reply_dir: 'Vada dritto per questa strada e poi giri a destra all’angolo.',
    reply_shop: 'Sono 1.500 yen. Accettiamo carte di credito e pagamenti digitali.',
    reply_food: 'Ecco il nostro menu. I ramen speciali dello chef sono i più apprezzati!',
  },
};

function getTranslatedPair(phraseKey, srcCode, tgtCode) {
  const srcPack = CONVERSATION_DATA[srcCode] || CONVERSATION_DATA.en;
  const tgtPack = CONVERSATION_DATA[tgtCode] || CONVERSATION_DATA.ja;
  const srcText = srcPack[phraseKey] || srcPack.directions || 'Hello';
  const tgtText = tgtPack[phraseKey] || tgtPack.directions || 'こんにちは';
  return { srcText, tgtText };
}

function SvgIcon({ name, size = 20, color = teal }) {
  const icons = {
    ChevronLeft: <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    Speaker: (
      <>
        <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    Keyboard: (
      <>
        <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8" />
        <Path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    Trash: (
      <>
        <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    Send: <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    Check: <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
    AutoPlayOn: (
      <>
        <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {icons[name] || null}
    </Svg>
  );
}

// 3D Spherical Swap Button
function ThreeDSwapButton({ onPress, size = 38, rotation }) {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.9, useNativeDriver: Platform.OS !== 'web', speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web', speed: 25 }).start();
  };

  const iconSize = Math.round(size * 0.46);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Swap conversation languages"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: '#005f56',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 6,
            overflow: 'hidden',
            backgroundColor: '#008b80',
          }}
        >
          <LinearGradient
            colors={['#5bf8dc', '#22d3b6', '#00a392', '#006e64', '#00433c']}
            start={{ x: 0.1, y: 0.05 }}
            end={{ x: 0.9, y: 0.95 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Top specular highlight pill */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: Math.round(size * 0.07),
              left: Math.round(size * 0.15),
              width: Math.round(size * 0.54),
              height: Math.round(size * 0.26),
              borderRadius: Math.round(size * 0.26) / 2,
              transform: [{ rotate: '-18deg' }],
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.75)', 'rgba(255, 255, 255, 0.06)']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          {/* Bottom rim bounce light */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: 1,
              left: Math.round(size * 0.15),
              width: Math.round(size * 0.7),
              height: Math.round(size * 0.22),
              borderRadius: Math.round(size * 0.22) / 2,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['rgba(90, 250, 225, 0)', 'rgba(90, 250, 225, 0.45)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          {/* Swap arrows */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 8H5M5 8l3.5-3.5M5 8l3.5 3.5 M5 16h14m0 0l-3.5-3.5M19 16l-3.5 3.5"
                  stroke="rgba(0, 48, 42, 0.42)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(0, 1)"
                />
                <Path
                  d="M19 8H5M5 8l3.5-3.5M5 8l3.5 3.5 M5 16h14m0 0l-3.5-3.5M19 16l-3.5 3.5"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Pulsing Audio Waveform Bars (Active in both standby & listening, matching main page)
function ConversationWaveform({ isListening, scale = 1, reverse = false }) {
  const bars = useRef([
    new Animated.Value(0.2),
    new Animated.Value(0.5),
    new Animated.Value(0.9),
    new Animated.Value(0.6),
    new Animated.Value(0.3),
  ]).current;

  // Traditional harmonic rolling sine wave (Google / Siri style) - active in both standby & listening
  useEffect(() => {
    const duration = isListening ? 380 : 720;
    const staggerDelay = isListening ? 65 : 115;

    const barLoops = bars.map((bar, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * staggerDelay),
          Animated.timing(bar, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
    });

    barLoops.forEach(l => l.start());

    return () => {
      barLoops.forEach(l => l.stop());
    };
  }, [isListening, bars]);

  // Classic voice assistant wave heights (balanced & proportionate)
  const baseHeights = [8, 16, 30, 20, 10];
  const barW = Math.max(3, Math.round(3.4 * scale));
  const barGap = Math.max(4, Math.round(4.5 * scale));
  const barIndices = reverse ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: barGap, height: Math.round(42 * scale), justifyContent: 'center' }}>
      {barIndices.map((idx, pos) => {
        const baseH = baseHeights[idx];
        const barAnim = bars[idx];
        const barHeight = barAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            Math.max(4, Math.round(baseH * (isListening ? 0.35 : 0.5) * scale)),
            Math.round(baseH * (isListening ? 1.45 : 1.15) * scale),
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={pos}
            style={{
              height: barHeight,
              width: barW,
              borderRadius: barW / 2,
              backgroundColor: isListening ? '#00f5d4' : '#2dd4bf',
              shadowColor: isListening ? '#00f5d4' : '#14b8a6',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isListening ? 0.7 : 0.25,
              shadowRadius: isListening ? 5 : 2,
            }}
          />
        );
      })}
    </View>
  );
}

export default function ConversationScreen({
  source = POPULAR_LANGUAGES[0],
  target = POPULAR_LANGUAGES[1],
  onUpdateSource,
  onUpdateTarget,
  onBack,
  scale = 1,
  transitionAnim,
  autoListen = false,
}) {
  const inset = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const w = Platform.OS === 'web' ? Math.min(432, width) : width;

  // Active languages
  const [srcLang, setSrcLang] = useState(source);
  const [tgtLang, setTgtLang] = useState(target);

  // Active Speaker: 'source' (e.g. English / You) | 'target' (e.g. Japanese / Partner)
  const [activeSpeaker, setActiveSpeaker] = useState('source');

  // Listening state
  const [isListening, setIsListening] = useState(false);
  const [listeningTranscript, setListeningTranscript] = useState('');
  const [listeningTranslation, setListeningTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Auto-speak translation aloud
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Modal pickers
  const [pickerType, setPickerType] = useState(null); // 'source' | 'target'
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  // 3D Swap Animation
  const swapAnim = useRef(new Animated.Value(0)).current;
  const [swapped, setSwapped] = useState(false);

  // Mic Pulse animation
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const micScaleAnim = useRef(new Animated.Value(1)).current;

  // Scroll View ref
  const scrollRef = useRef(null);

  // Conversation Dialogue Messages
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      speaker: 'source', // You (English)
      originalText: 'Excuse me, where is the nearest subway station?',
      translatedText: 'すみません、一番近い地下鉄の駅はどこですか？',
      srcLang: POPULAR_LANGUAGES[0],
      tgtLang: POPULAR_LANGUAGES[1],
      time: 'Just now',
    },
    {
      id: 'm2',
      speaker: 'target', // Partner (Japanese)
      originalText: 'この道をまっすぐ進んで、角を右に曲がってください。',
      translatedText: 'Go straight down this street, then turn right at the corner.',
      srcLang: POPULAR_LANGUAGES[1],
      tgtLang: POPULAR_LANGUAGES[0],
      time: 'Just now',
    },
  ]);

  // Handle hardware back on Android
  useEffect(() => {
    const onBackPress = () => {
      if (onBack) {
        onBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [onBack]);

  // Ambient Mic Glow Loop
  useEffect(() => {
    let loop;
    if (isListening) {
      pulseAnim.setValue(0);
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      loop.start();
    } else {
      pulseAnim.setValue(0);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isListening]);

  // Handle Swap
  const handleSwap = () => {
    Animated.spring(swapAnim, {
      toValue: swapped ? 0 : 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
    setSwapped(!swapped);

    const prevSrc = srcLang;
    const prevTgt = tgtLang;
    setSrcLang(prevTgt);
    setTgtLang(prevSrc);
    if (onUpdateSource) onUpdateSource(prevTgt);
    if (onUpdateTarget) onUpdateTarget(prevSrc);
  };

  const swapRotation = swapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const glowShadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.38, 0.72],
  });

  // Auto-listen when arriving on conversation screen
  useEffect(() => {
    if (autoListen) {
      const timer = setTimeout(() => {
        triggerListening();
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [autoListen]);

  // Mic slide-down transition interpolations
  const bottomCardTranslateY = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [120, 0],
      })
    : 0;

  const bottomCardOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0.3, 0.75],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const bottomMicOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0, 0.94, 0.98, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const bottomWavesOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0.75, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const bottomSubControlsOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0.7, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const headerTranslateY = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-35, 0],
      })
    : 0;

  const headerOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0.35, 0.85],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const chatFeedOpacity = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0.45, 0.95],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 1;

  const chatFeedTranslateY = transitionAnim
    ? transitionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [35, 0],
      })
    : 0;

// Voice speech playback will be integrated in the speech synthesis engine
const speakTranslation = async (text, langCode) => {};

  // Perform Live Voice Simulation / Speech Translation
  const triggerListening = (phraseKey = null, customText = null) => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      setListeningTranscript('');
      setListeningTranslation('');
      return;
    }

    setIsListening(true);
    const speakerLang = activeSpeaker === 'source' ? srcLang : tgtLang;
    const receiverLang = activeSpeaker === 'source' ? tgtLang : srcLang;

    // Pick phrase
    const keys = ['directions', 'shopping', 'food', 'help', 'greeting', 'thanks'];
    const chosenKey = phraseKey || keys[Math.floor(Math.random() * keys.length)];

    let original = customText;
    let translated = '';

    if (!original) {
      const pair = getTranslatedPair(chosenKey, speakerLang.code, receiverLang.code);
      original = pair.srcText;
      translated = pair.tgtText;
    } else {
      const pair = getTranslatedPair('directions', speakerLang.code, receiverLang.code);
      translated = pair.tgtText;
    }

    setListeningTranscript(original);
    setListeningTranslation('Translating into ' + receiverLang.name + '...');

    // Simulate real-time speech capture and translation delay
    setTimeout(() => {
      setListeningTranslation(translated);
      setIsTranslating(true);

      setTimeout(() => {
        setIsListening(false);
        setIsTranslating(false);

        // Add to dialogue messages
        const newMsg = {
          id: 'm_' + Date.now(),
          speaker: activeSpeaker,
          originalText: original,
          translatedText: translated,
          srcLang: speakerLang,
          tgtLang: receiverLang,
          time: 'Just now',
        };

        setMessages((prev) => [...prev, newMsg]);

        // Auto-speak translated voice aloud
        if (autoSpeak) {
          speakTranslation(translated, receiverLang.code);
        }

        // Auto-switch speaker for smooth back-and-forth dialogue
        setActiveSpeaker((prev) => (prev === 'source' ? 'target' : 'source'));

        // Scroll to bottom
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }, 700);
    }, 1100);
  };

  // Mic press in/out animation
  const handleMicPressIn = () => {
    Animated.spring(micScaleAnim, { toValue: 0.92, speed: 30, useNativeDriver: true }).start();
  };
  const handleMicPressOut = () => {
    Animated.spring(micScaleAnim, { toValue: 1, speed: 25, useNativeDriver: true }).start();
  };

  const handleSendTyped = () => {
    if (!typedMessage.trim()) return;
    const text = typedMessage.trim();
    setTypedMessage('');
    setTextInputVisible(false);
    triggerListening('directions', text);
  };

  const clearMessages = () => {
    setMessages([]);
    Speech.stop().catch(() => {});
  };

  const sOrb = Math.round(86 * scale);

  return (
    <View style={[s.container, { backgroundColor: 'transparent' }]}>
      <View style={{ width: w, flex: 1, paddingTop: inset.top }}>
        {/* ========================================================================= */}
        {/* TOP BAR & HEADER + LANGUAGE BAR (ANIMATED)                                */}
        {/* ========================================================================= */}
        <Animated.View style={{ transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }}>
          <View style={s.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Translate"
              onPress={onBack}
              style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <SvgIcon name="ChevronLeft" size={24} color={ink} />
            </Pressable>

            <View style={{ alignItems: 'center' }}>
              <Text style={[s.topTitle, { fontSize: Math.round(18 * scale) }]}>Conversation</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear Conversation"
              onPress={clearMessages}
              style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <SvgIcon name="Trash" size={20} color={muted} />
            </Pressable>
          </View>

          {/* TOP LANGUAGE TRANSLATION BUTTON / SELECTOR */}
          <View style={s.langCardWrapper}>
            <View style={s.langCard}>
              {/* Source Language Pill */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Select source language, ${srcLang.name}`}
                onPress={() => setPickerType('source')}
                style={({ pressed }) => [s.langPill, pressed && s.langPillPressed]}
              >
                <Text style={s.langFlag}>{srcLang.flag}</Text>
                <Text numberOfLines={1} style={s.langName}>
                  {srcLang.name}
                </Text>
                <Text style={s.langChevron}>⌄</Text>
              </Pressable>

              {/* 3D Swap Button */}
              <ThreeDSwapButton onPress={handleSwap} size={Math.round(40 * scale)} rotation={swapRotation} />

              {/* Target Language Pill */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Select target language, ${tgtLang.name}`}
                onPress={() => setPickerType('target')}
                style={({ pressed }) => [s.langPill, pressed && s.langPillPressed]}
              >
                <Text style={s.langFlag}>{tgtLang.flag}</Text>
                <Text numberOfLines={1} style={s.langName}>
                  {tgtLang.name}
                </Text>
                <Text style={s.langChevron}>⌄</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* ========================================================================= */}
        {/* CONVERSATION MESSAGE STREAM (ANIMATED)                                    */}
        {/* ========================================================================= */}
        <Animated.View style={{ flex: 1, opacity: chatFeedOpacity, transform: [{ translateY: chatFeedTranslateY }] }}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && !isListening && (
              <View style={s.emptyStateWrap}>
                <View style={s.emptyIconCircle}>
                  <Image
                    source={require('./assets/home/microphone.png')}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={s.emptyTitle}>Start Your Conversation</Text>
                <Text style={s.emptySub}>
                  Tap the mic below to speak in {activeSpeaker === 'source' ? srcLang.name : tgtLang.name}.
                  Bubble will translate in real-time.
                </Text>
              </View>
            )}

            {messages.map((item) => {
              const isMe = item.speaker === 'source';
              return (
                <View
                  key={item.id}
                  style={[s.bubbleRow, isMe ? s.bubbleRowRight : s.bubbleRowLeft]}
                >
                  <View style={[s.bubbleCard, isMe ? s.bubbleCardMe : s.bubbleCardPartner]}>
                    {/* Speaker Label & Flag */}
                    <View style={s.bubbleHeaderRow}>
                      <View style={s.bubbleSpeakerTag}>
                        <Text style={s.bubbleFlag}>{item.srcLang.flag}</Text>
                        <Text style={s.bubbleSpeakerText}>
                          {isMe ? 'You (' + item.srcLang.name + ')' : item.srcLang.name}
                        </Text>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Play audio translation"
                        onPress={() => speakTranslation(item.translatedText, item.tgtLang.code)}
                        style={({ pressed }) => [s.speakerBtn, pressed && { opacity: 0.6 }]}
                      >
                        <SvgIcon name="Speaker" size={17} color={isMe ? teal : '#006d64'} />
                      </Pressable>
                    </View>

                    {/* Original Spoken Text */}
                    <Text style={s.originalText}>{item.originalText}</Text>

                    <View style={s.bubbleDivider} />

                    {/* Translated Text */}
                    <View style={s.translatedRow}>
                      <Text style={s.translatedText}>{item.translatedText}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Active Listening Indicator Card */}
            {isListening && (
              <View style={s.activeListeningCard}>
                <View style={s.activeListeningTop}>
                  <View style={s.pulseRecordingDot} />
                  <Text style={s.activeListeningTitle}>
                    Listening to {activeSpeaker === 'source' ? srcLang.name : tgtLang.name}...
                  </Text>
                </View>
                {Boolean(listeningTranscript) && (
                  <Text style={s.listeningTranscriptText}>{listeningTranscript}</Text>
                )}
                {Boolean(listeningTranslation) && (
                  <Text style={s.listeningTranslationText}>{listeningTranslation}</Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: 3D MIC AT BOTTOM & CONTROLS (FLUID ANIMATED GLIDE)        */}
        {/* ========================================================================= */}
        <Animated.View
          style={[
            s.bottomMicArea,
            {
              backgroundColor: '#ffffff',
              borderColor: '#e0f1ee',
              paddingBottom: Math.max(16, inset.bottom),
              transform: [{ translateY: bottomCardTranslateY }],
              opacity: bottomCardOpacity,
            },
          ]}
        >
          {/* Central 3D Listening Mic Ball with Equalizer Waveform */}
          <View style={s.micRow}>
            {/* Left Sound Wave */}
            <Animated.View style={{ opacity: bottomWavesOpacity }}>
              <ConversationWaveform isListening={isListening} scale={scale} />
            </Animated.View>

            {/* 3D Mic Ball */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isListening ? 'Stop listening' : 'Start speaking'}
              onPress={() => triggerListening()}
              onPressIn={handleMicPressIn}
              onPressOut={handleMicPressOut}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <Animated.View
                style={{
                  opacity: bottomMicOpacity,
                  transform: [{ scale: micScaleAnim }],
                }}
              >
                <Animated.View
                  style={[
                    s.micSphere,
                    {
                      width: sOrb,
                      height: sOrb,
                      borderRadius: sOrb / 2,
                      shadowColor: isListening ? '#00e5cc' : '#014e47',
                      shadowOffset: { width: 0, height: isListening ? 6 : 8 },
                      shadowOpacity: isListening ? glowShadowOpacity : 0.35,
                      shadowRadius: isListening ? 20 : 12,
                      elevation: isListening ? 10 : 6,
                    },
                  ]}
                >
                  <Image
                    source={require('./assets/home/microphone.png')}
                    resizeMode="contain"
                    style={{ width: '88%', height: '88%' }}
                  />
                </Animated.View>
              </Animated.View>
            </Pressable>

            {/* Right Sound Wave */}
            <Animated.View style={{ opacity: bottomWavesOpacity }}>
              <ConversationWaveform isListening={isListening} scale={scale} reverse />
            </Animated.View>
          </View>

          {/* Status Label & Keyboard Toggle */}
          <Animated.View style={[s.micFooterRow, { opacity: bottomSubControlsOpacity }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Type translation"
              onPress={() => setTextInputVisible(true)}
              style={({ pressed }) => [s.actionCircleBtn, pressed && { opacity: 0.6 }]}
            >
              <SvgIcon name="Keyboard" size={20} color={teal} />
            </Pressable>

            <View style={{ alignItems: 'center' }}>
              <Text style={s.micStatusTitle}>
                {isListening ? 'Listening...' : 'Tap to speak'}
              </Text>
              <Text style={s.micStatusSub}>
                {isListening ? 'Speak clearly into mic' : 'Translate into ' + (activeSpeaker === 'source' ? tgtLang.name : srcLang.name)}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Toggle voice playback"
              onPress={() => setAutoSpeak(!autoSpeak)}
              style={({ pressed }) => [s.actionCircleBtn, autoSpeak && s.actionCircleActive, pressed && { opacity: 0.6 }]}
            >
              <SvgIcon name="AutoPlayOn" size={20} color={autoSpeak ? '#ffffff' : muted} />
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* Modal Language Selector */}
        <Modal
          visible={Boolean(pickerType)}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerType(null)}
        >
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { width: w, maxHeight: '72%', paddingBottom: Math.max(22, inset.bottom) }]}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>
                  {pickerType === 'source' ? 'Select Spoken Language' : 'Select Target Language'}
                </Text>
                <Pressable onPress={() => setPickerType(null)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView>
                {POPULAR_LANGUAGES.map((item) => {
                  const isSelected =
                    pickerType === 'source' ? srcLang.code === item.code : tgtLang.code === item.code;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        if (pickerType === 'source') {
                          if (item.code === tgtLang.code) setTgtLang(srcLang);
                          setSrcLang(item);
                          if (onUpdateSource) onUpdateSource(item);
                        } else {
                          if (item.code === srcLang.code) setSrcLang(tgtLang);
                          setTgtLang(item);
                          if (onUpdateTarget) onUpdateTarget(item);
                        }
                        setPickerType(null);
                      }}
                      style={s.pickerItem}
                    >
                      <Text style={s.pickerItemText}>
                        {item.flag}   {item.name} {item.native ? `(${item.native})` : ''}
                      </Text>
                      {isSelected && <SvgIcon name="Check" size={18} color={teal} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Text Input Modal Fallback */}
        <Modal
          visible={textInputVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTextInputVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={[s.textInputCard, { width: Math.min(w * 0.9, 360) }]}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Type message to translate</Text>
                <Pressable onPress={() => setTextInputVisible(false)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <TextInput
                placeholder={`Type in ${activeSpeaker === 'source' ? srcLang.name : tgtLang.name}...`}
                placeholderTextColor="#8aa6ac"
                value={typedMessage}
                onChangeText={setTypedMessage}
                style={s.textInputField}
                multiline
                autoFocus
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Translate and Send"
                onPress={handleSendTyped}
                style={s.sendTypedBtn}
              >
                <Text style={s.sendTypedText}>Translate & Speak</Text>
                <SvgIcon name="Send" size={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: 'transparent' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topTitle: { fontWeight: '800', color: ink, letterSpacing: -0.5 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  // Top Language Translation Card
  langCardWrapper: { paddingHorizontal: 16, paddingBottom: 6 },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#e1f2ef',
    shadowColor: '#0a3d38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  langPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dff1ee',
  },
  langPillPressed: { backgroundColor: '#f0fcfb', borderColor: '#78dfd4' },
  langFlag: { fontSize: 18, marginRight: 6 },
  langName: { flex: 1, fontSize: 13, fontWeight: '700', color: ink },
  langChevron: { fontSize: 14, color: '#57787f', fontWeight: '700' },

  // Conversation Dialogue Messages
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 14, flexGrow: 1 },
  emptyStateWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 40, paddingHorizontal: 24, gap: 10 },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dff1ee',
    shadowColor: '#005f56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: ink },
  emptySub: { fontSize: 13, color: muted, textAlign: 'center', lineHeight: 19 },

  bubbleRow: { flexDirection: 'row', width: '100%' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },

  bubbleCard: {
    maxWidth: '86%',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#0a3d38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 6,
  },
  bubbleCardMe: { backgroundColor: '#ffffff', borderColor: '#d7efea' },
  bubbleCardPartner: { backgroundColor: '#f0fcf9', borderColor: '#c8ebe4' },

  bubbleHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bubbleSpeakerTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubbleFlag: { fontSize: 15 },
  bubbleSpeakerText: { fontSize: 11.5, fontWeight: '700', color: '#50757b' },
  speakerBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e8f7f4', alignItems: 'center', justifyContent: 'center' },

  originalText: { fontSize: 14.5, fontWeight: '500', color: '#335056', lineHeight: 21 },
  bubbleDivider: { height: 1, backgroundColor: '#eaf4f2', marginVertical: 2 },
  translatedRow: { flexDirection: 'row', alignItems: 'center' },
  translatedText: { fontSize: 15.5, fontWeight: '750', color: '#00655d', lineHeight: 22 },

  // Active Listening Card
  activeListeningCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#2dd4bf',
    shadowColor: '#00baa8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    gap: 6,
  },
  activeListeningTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulseRecordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00cbb7' },
  activeListeningTitle: { fontSize: 13, fontWeight: '700', color: teal },
  listeningTranscriptText: { fontSize: 15, fontWeight: '600', color: ink },
  listeningTranslationText: { fontSize: 14, fontWeight: '500', color: '#007066', fontStyle: 'italic' },

  // Quick Prompts Bar
  quickPromptsBar: { paddingVertical: 6 },
  promptChip: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#dff1ee',
  },
  promptChipPressed: { backgroundColor: '#e2f7f4' },
  promptChipText: { fontSize: 12, fontWeight: '700', color: ink },

  // Bottom 3D Mic Section
  bottomMicArea: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#e0f1ee',
    shadowColor: '#0a3c39',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    gap: 12,
  },

  micRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, paddingVertical: 4 },
  micSphere: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  micFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#edf8f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dceee9',
  },
  actionCircleActive: { backgroundColor: teal, borderColor: teal },
  micStatusTitle: { fontSize: 15, fontWeight: '800', color: ink },
  micStatusSub: { fontSize: 11, fontWeight: '500', color: muted, marginTop: 1 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10,35,38,0.42)', alignItems: 'center', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: ink },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#edf7f5', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 13, fontWeight: '800', color: muted },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: '#ebf4f1',
  },
  pickerItemText: { fontSize: 14.5, fontWeight: '600', color: ink },

  textInputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    gap: 12,
    alignSelf: 'center',
    marginVertical: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  textInputField: {
    backgroundColor: '#f6fbf9',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#d7ece6',
    padding: 14,
    fontSize: 14.5,
    color: ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendTypedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006d64',
    paddingVertical: 12,
    borderRadius: 16,
  },
  sendTypedText: { color: '#ffffff', fontSize: 14, fontWeight: '750' },
});
