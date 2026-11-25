import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Image, BackHandler, Modal, Platform, Pressable,
  ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as Paint, Path, Stop } from 'react-native-svg';
import ProfileSetup from './ProfileSetup';
import TranslatorHome from './TranslatorHome';

const pages = [
  { art: require('./assets/onboarding/translate.png'), title: 'Translate Anywhere', copy: 'Speak, type, or scan to\ncommunicate in any language.' },
  { art: require('./assets/onboarding/voice.png'), title: 'Real-Time Voice\nTranslation', copy: 'Have a natural conversation\nacross languages.' },
  { art: require('./assets/onboarding/travel.png'), title: 'Your Travel Companion', copy: 'Perfect for shopping, dining,\nasking directions, and more.' },
];

function Waves() {
  return <View pointerEvents="none" style={s.waves}>
    <Svg width="100%" height="100%" viewBox="0 0 360 320" preserveAspectRatio="none">
      <Defs>
        <Paint id="water" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#9ce9e7"/><Stop offset="1" stopColor="#daf8f8"/>
        </Paint>
        <Paint id="crest" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#66d9d4"/><Stop offset="1" stopColor="#d8f8f8"/>
        </Paint>
      </Defs>
      <Path d="M0 98 C72 89 97 167 184 148 C276 132 317 38 360 0 V320 H0Z" fill="url(#water)"/>
      <Path d="M0 126 C124 76 161 217 360 161 V320 H0Z" fill="#dcf8f7" opacity=".85"/>
      <Path d="M0 178 Q94 130 189 193 Q66 156 0 274Z" fill="url(#crest)"/>
      <Path d="M173 320 Q250 211 360 238 V320Z" fill="#a5e9e7"/>
    </Svg>
  </View>;
}

function Screens() {
  const [step, setStep] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { width, height } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const w = Platform.OS === 'web' ? Math.min(width, 432) : width;
  const unit = Math.min(w / 360, 1.28);
  const canvasHeight = Math.max(height, 590 * unit + inset.bottom);
  const page = pages[step];
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    const entrance = Animated.timing(reveal, { toValue: 1, duration: 300, useNativeDriver: Platform.OS !== 'web' });
    entrance.start();
    return () => entrance.stop();
  }, [step, reveal]);

  useEffect(() => {
    if (step !== -1) return;
    const timer = setTimeout(() => setStep(0), 6000);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step <= 0 || step === 4) return false;
      setStep(step - 1);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  if (step === 4) return <TranslatorHome profile={userProfile} />;

  // Step 3 is Profile Setup
  if (step === 3) {
    return (
      <View style={s.outer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ProfileSetup
          onComplete={(profile) => {
            setUserProfile(profile);
            setFinished(true);
          }}
          onSkip={() => setStep(4)}
          onBack={() => setStep(2)}
        />
        <Modal visible={finished} transparent animationType="fade" onRequestClose={() => setFinished(false)}>
          <View style={s.overlay}>
            <View style={[s.dialog, { width: Math.min(w * 0.88, 360) }]}>
              <View style={s.profileAvatarWrap}>
                <View style={s.dialogAvatar}>
                  <LinearGradient
                    colors={['#ffffff', '#e8f7f5']}
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {userProfile?.fullName && userProfile.fullName !== 'Traveler' && (userProfile.firstName || userProfile.lastName) ? (
                      <Text style={{ fontSize: 24, fontWeight: '800', color: '#00746c' }}>
                        {((userProfile.firstName?.[0] || '') + (userProfile.lastName?.[0] || '')).toUpperCase()}
                      </Text>
                    ) : (
                      <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
                        <Circle cx="12" cy="7.5" r="4.3" fill="#008b80" />
                        <Path
                          d="M4.5 19.8C5.6 15.8 8.5 13.5 12 13.5C15.5 13.5 18.4 15.8 19.5 19.8C17.3 21 14.8 21.6 12 21.6C9.2 21.6 6.7 21 4.5 19.8Z"
                          fill="#008b80"
                        />
                      </Svg>
                    )}
                  </LinearGradient>
                </View>
              </View>

              <View style={{ alignItems: 'center', gap: 6 }}>
                <Text style={[s.heading, { fontSize: 24 }]}>
                  {userProfile?.fullName && userProfile.fullName !== 'Traveler' ? `Welcome, ${userProfile.fullName}!` : 'Profile Created!'}
                </Text>
                <Text style={s.dialogSub}>Your personal travel interpreter is ready.</Text>
              </View>

              <View style={s.profileSummaryCard}>
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Primary Language</Text>
                  <Text style={s.summaryVal}>
                    {userProfile?.language?.flag || '🇺🇸'} {userProfile?.language?.name || 'English'}
                  </Text>
                </View>
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Home Country</Text>
                  <Text style={s.summaryVal}>
                    {userProfile?.country?.flag || '🌐'} {userProfile?.country?.name || 'Not set'}
                  </Text>
                </View>
                {Boolean(userProfile?.age) && (
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>Age</Text>
                    <Text style={s.summaryVal}>{userProfile.age} yrs</Text>
                  </View>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setFinished(false);
                  setStep(4);
                }}
                style={s.restart}
              >
                <Text style={s.buttonText}>Start translating</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return <View style={s.outer}>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    <ScrollView style={{ width: w }} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
      <LinearGradient colors={['#f1f9fa', '#f9fcfc', '#e4f6f6']} style={[s.panel, { minHeight: canvasHeight }]}>
        {!page ? <>
          <Waves/>
          <View style={[s.middle, { top: '27%' }]}>
            <Image source={require("./assets/onboarding/bubble.png")} resizeMode="contain" style={{width:148*unit,height:129*unit}}/>
            <Text style={[s.heading, { fontSize: 58*unit, letterSpacing: -2.6*unit }]}>Bubble</Text>
            <Text style={[s.slogan, { fontSize: 24*unit, marginTop: 17*unit }]}>Break language barriers{'\n'}instantly.</Text>
          </View>
          <ActivityIndicator accessibilityLabel="Loading Bubble" color="#00a99e" style={[s.loader, { bottom: Math.max(inset.bottom+12, canvasHeight*.08) }]}/>
        </> : <>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setStep(3)} style={[s.skip, { marginTop: inset.top + 12, marginRight: 26*unit }]}>
            <Text style={[s.skipText, { fontSize: 17*unit }]}>Skip</Text>
          </Pressable>
          <Animated.View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 20, opacity: reveal, transform: [{ translateX: reveal.interpolate({inputRange:[0,1],outputRange:[16,0]}) }] }}>
            <Image source={page.art} resizeMode="contain" style={{width:w*.91,height:canvasHeight*.34}}/>
            <Text accessibilityRole="header" style={[s.heading, { marginTop: canvasHeight*.016, fontSize: 29*unit, lineHeight: 34*unit }]}>{page.title}</Text>
            <Text style={[s.copy, { fontSize: 21*unit, lineHeight: 30*unit, marginTop: 24*unit }]}>{page.copy}</Text>
          </Animated.View>
          <View style={[s.footer, { paddingBottom: inset.bottom+24, paddingHorizontal: 22*unit }]}>
            <View accessible accessibilityLabel={`Page ${step+1} of 3`} style={[s.dots, { marginBottom: 20 }]}>
              {pages.map((p,i) => <View key={p.title} style={[s.dot, { width: 10*unit, height: 10*unit, backgroundColor: i === step ? '#039b90' : '#78d4d7' }]}/>)}
            </View>
            <Pressable accessibilityRole="button" onPress={() => step === 2 ? setStep(3) : setStep(step+1)} style={({pressed}) => ({opacity: pressed ? .84 : 1})}>
              <LinearGradient colors={['#26b8ac','#009689','#007a72']} style={[s.button, { height: 60*unit }]}>
                <Text style={[s.buttonText, { fontSize: 23*unit }]}>{step === 2 ? 'Get Started' : 'Next'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </>}
      </LinearGradient>
    </ScrollView>
    <Modal visible={finished} transparent animationType="fade" onRequestClose={() => setFinished(false)}>
      <View style={s.overlay}><View style={s.dialog}>
        <Text style={[s.heading,{fontSize:26}]}>Onboarding complete</Text>
        <Pressable accessibilityRole="button" onPress={() => { setFinished(false); setStep(-1); }} style={s.restart}>
          <Text style={s.buttonText}>Replay preview</Text>
        </Pressable>
      </View></View>
    </Modal>
  </View>;
}

export default function App() {
  return <SafeAreaProvider><Screens/></SafeAreaProvider>;
}

const s = StyleSheet.create({
  outer:{flex:1,alignItems:'center',backgroundColor:'#d9eeee'},
  panel:{flex:1,position:'relative',overflow:'hidden'},
  middle:{position:'absolute',width:'100%',alignItems:'center'},
  heading:{fontWeight:'800',color:'#080d16',textAlign:'center',letterSpacing:-.85},
  slogan:{fontWeight:'500',color:'#10161c',textAlign:'center'},
  copy:{color:'#101820',textAlign:'center'},
  waves:{position:'absolute',bottom:0,height:'37%',width:'100%'},
  loader:{position:'absolute',alignSelf:'center'},
  skip:{alignSelf:'flex-end',zIndex:1,minHeight:44,minWidth:44,alignItems:'flex-end',justifyContent:'center'},
  skipText:{fontWeight:'700',color:'#101820'},
  footer:{width:'100%'},
  dots:{flexDirection:'row',justifyContent:'center',gap:10},
  dot:{borderRadius:20},
  button:{borderRadius:100,alignItems:'center',justifyContent:'center'},
  buttonText:{color:'white',fontWeight:'600',fontSize:18},
  overlay:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(3,38,39,.35)'},
  dialog:{backgroundColor:'#f4fbfb',borderRadius:22,padding:24,gap:18,alignItems:'center'},
  restart:{backgroundColor:'#008b80',borderRadius:30,alignItems:'center',paddingVertical:14,width:'100%'},
  profileAvatarWrap:{alignItems:'center',marginBottom:4},
  dialogAvatar:{width:68,height:68,borderRadius:34,overflow:'hidden',borderWidth:2.5,borderColor:'#ffffff'},
  dialogAvatarText:{fontSize:26,fontWeight:'800',color:'#ffffff'},
  dialogSub:{fontSize:13,color:'#4f7070',textAlign:'center'},
  profileSummaryCard:{backgroundColor:'#ffffff',borderRadius:16,padding:14,width:'100%',gap:10,borderWidth:1,borderColor:'#d4efec'},
  summaryRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  summaryLabel:{fontSize:13,color:'#618585',fontWeight:'600'},
  summaryVal:{fontSize:14,color:'#092325',fontWeight:'700'},
});
