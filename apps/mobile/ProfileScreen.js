import React, { useEffect, useState } from 'react';
import {
  Alert, BackHandler, Image, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Switch, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Rect, Stop } from 'react-native-svg';
import { POPULAR_COUNTRIES, POPULAR_LANGUAGES } from './ProfileSetup';

const ink = '#112d33';
const teal = '#008b80';
const muted = '#65868c';

export function AvatarImage({ uri, size = 96, scale = 1 }) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }

  // Beautiful high-res 3D stylized profile avatar portrait
  return (
    <Image
      source={require('./assets/profile_default.png')}
      style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
      resizeMode="cover"
    />
  );
}

function Icon({ name, size = 20, color = teal }) {
  const icons = {
    Gear: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
        <Path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
          stroke={color}
          strokeWidth="1.8"
        />
      </Svg>
    ),
    ChevronLeft: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    ChevronRight: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    ChevronDown: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    EditPencil: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Camera: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.9" />
      </Svg>
    ),
    Globe: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
        <Path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="1.8" />
      </Svg>
    ),
    Translate: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 5h7M7 2v3M4 11c1.5 2 3.5 3.5 6 4M7 8a9.8 9.8 0 0 0 3 6M13 20l4-9 4 9M14.5 16.5h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Pin: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="1.8" />
        <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
      </Svg>
    ),
    Clock: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
        <Path d="M12 6v6l4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Bookmark: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Download: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    User: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8" />
      </Svg>
    ),
    Mail: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
        <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Chip: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.8" />
        <Path d="M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Bell: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Moon: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Shield: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Help: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
        <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Info: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
        <Path d="M12 16v-4 M12 8h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    ),
    Check: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  };

  return icons[name] || null;
}

export default function ProfileScreen({ profile, onUpdateProfile, onBack, onScreenChange, scale = 1 }) {
  const inset = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Platform.OS === 'web' ? Math.min(432, width) : width;

  // Active view: 'main' | 'edit' | 'settings'
  const [screen, setScreen] = useState('main');

  const changeScreen = (newScreen) => {
    setScreen(newScreen);
    if (onScreenChange) onScreenChange(newScreen);
  };

  useEffect(() => {
    const onBackPress = () => {
      if (screen !== 'main') {
        changeScreen('main');
        return true;
      } else if (onBack) {
        onBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [screen, onBack]);

  // User Profile Data
  const [userProfile, setUserProfile] = useState({
    fullName: profile?.fullName || 'Emma Carter',
    email: profile?.email || 'emma.carter@email.com',
    language: profile?.language || POPULAR_LANGUAGES[0], // English
    targetLanguage: profile?.targetLanguage || POPULAR_LANGUAGES[1], // Japanese
    country: profile?.country || POPULAR_COUNTRIES[0], // India
    avatarUri: profile?.avatarUri || null, // default is null (uses default avatar)
  });

  // Edit screen state
  const [editName, setEditName] = useState(userProfile.fullName);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editNative, setEditNative] = useState(userProfile.language);
  const [editTarget, setEditTarget] = useState(userProfile.targetLanguage);
  const [editCountry, setEditCountry] = useState(userProfile.country);
  const [editAvatarUri, setEditAvatarUri] = useState(userProfile.avatarUri);

  // Pickers modal
  const [pickerType, setPickerType] = useState(null); // 'native' | 'target' | 'country'
  const [pickerVisible, setPickerVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [dialogInfo, setDialogInfo] = useState(null);

  const showInfo = (title, message) => {
    if (Platform.OS === 'web') {
      setDialogInfo({ title, message });
    } else {
      Alert.alert(title, message);
    }
  };

  const pickAvatarImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Please grant photo library access to upload a profile photo.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setEditAvatarUri(selectedUri);
        const updated = { ...userProfile, avatarUri: selectedUri };
        setUserProfile(updated);
        if (onUpdateProfile) onUpdateProfile(updated);
        setAvatarModalVisible(false);
      }
    } catch (err) {
      console.warn('Avatar picker error:', err);
    }
  };

  const resetToDefaultAvatar = () => {
    setEditAvatarUri(null);
    const updated = { ...userProfile, avatarUri: null };
    setUserProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    setAvatarModalVisible(false);
  };

  const handleSave = () => {
    const updated = {
      ...userProfile,
      fullName: editName.trim() || 'Emma Carter',
      email: editEmail.trim() || 'emma.carter@email.com',
      language: editNative,
      targetLanguage: editTarget,
      country: editCountry,
      avatarUri: editAvatarUri,
    };
    setUserProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);
    changeScreen('main');
  };

  return (
    <View style={s.container}>
      <LinearGradient colors={['#e8f8f6', '#f5fcfa', '#d9f2ee']} style={{ width: w, flex: 1, paddingTop: inset.top }}>
        {/* ========================================================================= */}
        {/* SCREEN 1: PROFILE MAIN VIEW                                               */}
        {/* ========================================================================= */}
        {screen === 'main' && (
          <View style={{ flex: 1 }}>
            {/* Top Bar with beautiful "Profile" header */}
            <View style={s.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to Translate"
                onPress={onBack}
                style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.65 }]}
              >
                <Icon name="ChevronLeft" size={24} color={ink} />
              </Pressable>
              <Text style={[s.topBarTitle, { fontSize: Math.round(18 * scale) }]}>Profile</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              contentContainerStyle={s.contentScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Banner Illustration & Overlapping Avatar */}
              <View style={s.heroContainer}>
                <Image
                  source={require('./assets/onboarding/profile banner.png')}
                  style={[s.fujiBg, { height: Math.round(155 * scale) }]}
                  resizeMode="cover"
                />
                <View style={s.avatarCenterWrap}>
                  <View
                    style={[
                      s.avatarCircle,
                      {
                        width: Math.round(96 * scale),
                        height: Math.round(96 * scale),
                        borderRadius: Math.round(48 * scale),
                      },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Profile Photo"
                      onPress={() => setAvatarModalVisible(true)}
                      style={{ width: '100%', height: '100%', borderRadius: Math.round(48 * scale), overflow: 'hidden' }}
                    >
                      <AvatarImage uri={userProfile.avatarUri} size={Math.round(96 * scale)} scale={scale} />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Upload or Change Photo"
                      onPress={() => setAvatarModalVisible(true)}
                      style={({ pressed }) => [s.editPencilBadge, pressed && { transform: [{ scale: 0.92 }] }]}
                    >
                      <Icon name="Camera" size={13} color="#ffffff" />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* User Name & Email */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit Profile"
                onPress={() => {
                  setEditName(userProfile.fullName);
                  setEditEmail(userProfile.email);
                  setEditNative(userProfile.language);
                  setEditTarget(userProfile.targetLanguage);
                  setEditCountry(userProfile.country);
                  setEditAvatarUri(userProfile.avatarUri);
                  changeScreen('edit');
                }}
                style={({ pressed }) => [s.userInfoWrap, pressed && { opacity: 0.8 }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[s.userName, { fontSize: Math.round(22 * scale) }]}>{userProfile.fullName}</Text>
                  <Icon name="EditPencil" size={14} color="#5e8288" />
                </View>
                <Text style={[s.userEmail, { fontSize: Math.round(13 * scale) }]}>{userProfile.email}</Text>
              </Pressable>

              {/* Card 1: Languages & Country */}
              <View style={s.card}>
                <Pressable
                  onPress={() => {
                    setPickerType('native');
                    setPickerVisible(true);
                  }}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Globe" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Native Language</Text>
                  </View>
                  <View style={s.cardRowRight}>
                    <Text style={s.cardRowValue}>{userProfile.language?.name || 'English'}</Text>
                    <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                  </View>
                </Pressable>

                <View style={s.cardDivider} />

                <Pressable
                  onPress={() => {
                    setPickerType('target');
                    setPickerVisible(true);
                  }}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Translate" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Translate To</Text>
                  </View>
                  <View style={s.cardRowRight}>
                    <Text style={s.cardRowValue}>{userProfile.targetLanguage?.name || 'Japanese'}</Text>
                    <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                  </View>
                </Pressable>

                <View style={s.cardDivider} />

                <Pressable
                  onPress={() => {
                    setPickerType('country');
                    setPickerVisible(true);
                  }}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Pin" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Home Country</Text>
                  </View>
                  <View style={s.cardRowRight}>
                    <Text style={s.cardRowValue}>{userProfile.country?.name || 'India'}</Text>
                    <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                  </View>
                </Pressable>
              </View>

              {/* Card 2: History, Offline, Settings */}
              <View style={s.card}>
                <Pressable
                  onPress={() => showInfo('Translation History', '128 translations completed. Your voice and text queries are stored locally.')}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Clock" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Translation History</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                <Pressable
                  onPress={() => showInfo('Offline Languages', '3 language packs downloaded (English, Japanese, Spanish). Free space: 1.8 GB.')}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Download" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Offline Languages</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                <Pressable
                  onPress={() => changeScreen('settings')}
                  style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.cardRowLeft}>
                    <Icon name="Gear" size={20} color={teal} />
                    <Text style={s.cardRowLabel}>Settings</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: EDIT PROFILE VIEW                                               */}
        {/* ========================================================================= */}
        {screen === 'edit' && (
          <View style={{ flex: 1 }}>
            {/* Top Bar */}
            <View style={s.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={() => changeScreen('main')}
                style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}
              >
                <Icon name="ChevronLeft" size={24} color={ink} />
              </Pressable>
              <Text style={[s.topBarTitle, { fontSize: Math.round(18 * scale) }]}>Edit Profile</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={s.contentScroll} showsVerticalScrollIndicator={false}>
              {/* Centered Avatar with Camera Badge */}
              <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 18 }}>
                <View
                  style={[
                    s.avatarCircle,
                    {
                      width: Math.round(96 * scale),
                      height: Math.round(96 * scale),
                      borderRadius: Math.round(48 * scale),
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Profile Photo"
                    onPress={() => setAvatarModalVisible(true)}
                    style={{ width: '100%', height: '100%', borderRadius: Math.round(48 * scale), overflow: 'hidden' }}
                  >
                    <AvatarImage uri={editAvatarUri} size={Math.round(96 * scale)} scale={scale} />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change Photo"
                    onPress={() => setAvatarModalVisible(true)}
                    style={s.cameraBadge}
                  >
                    <Icon name="Camera" size={14} color="#ffffff" />
                  </Pressable>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Change Photo"
                  onPress={() => setAvatarModalVisible(true)}
                  style={({ pressed }) => [{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 4 }, pressed && { opacity: 0.7 }]}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: teal }}>Change Photo</Text>
                </Pressable>
              </View>

              {/* Form 1: Full Name */}
              <View style={s.formGroup}>
                <View style={s.formLabelRow}>
                  <Icon name="User" size={18} color={teal} />
                  <Text style={s.formLabel}>Full Name</Text>
                </View>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  style={s.formInput}
                  placeholder="Full Name"
                  placeholderTextColor="#8aa6ac"
                />
              </View>

              {/* Form 2: Email */}
              <View style={s.formGroup}>
                <View style={s.formLabelRow}>
                  <Icon name="Mail" size={18} color={teal} />
                  <Text style={s.formLabel}>Email</Text>
                </View>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  style={s.formInput}
                  placeholder="Email"
                  placeholderTextColor="#8aa6ac"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Form 3: Native Language */}
              <View style={s.formGroup}>
                <View style={s.formLabelRow}>
                  <Icon name="Globe" size={18} color={teal} />
                  <Text style={s.formLabel}>Native Language</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setPickerType('native');
                    setPickerVisible(true);
                  }}
                  style={s.formDropdown}
                >
                  <Text style={s.formDropdownText}>{editNative.name}</Text>
                  <Icon name="ChevronDown" size={18} color="#57787f" />
                </Pressable>
              </View>

              {/* Form 4: Preferred Translation Language */}
              <View style={s.formGroup}>
                <View style={s.formLabelRow}>
                  <Icon name="Translate" size={18} color={teal} />
                  <Text style={s.formLabel}>Preferred Translation Language</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setPickerType('target');
                    setPickerVisible(true);
                  }}
                  style={s.formDropdown}
                >
                  <Text style={s.formDropdownText}>{editTarget.name}</Text>
                  <Icon name="ChevronDown" size={18} color="#57787f" />
                </Pressable>
              </View>

              {/* Form 5: Home Country */}
              <View style={s.formGroup}>
                <View style={s.formLabelRow}>
                  <Icon name="Pin" size={18} color={teal} />
                  <Text style={s.formLabel}>Home Country</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setPickerType('country');
                    setPickerVisible(true);
                  }}
                  style={s.formDropdown}
                >
                  <Text style={s.formDropdownText}>{editCountry.name}</Text>
                  <Icon name="ChevronDown" size={18} color="#57787f" />
                </Pressable>
              </View>

              {/* Save Changes Button */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save Changes"
                onPress={handleSave}
                style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.88 }]}
              >
                <Text style={s.saveBtnText}>Save Changes</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: SETTINGS VIEW                                                   */}
        {/* ========================================================================= */}
        {screen === 'settings' && (
          <View style={{ flex: 1 }}>
            {/* Top Bar */}
            <View style={s.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={() => changeScreen('main')}
                style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}
              >
                <Icon name="ChevronLeft" size={24} color={ink} />
              </Pressable>
              <Text style={[s.topBarTitle, { fontSize: Math.round(18 * scale) }]}>Settings</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={s.contentScroll} showsVerticalScrollIndicator={false}>
              <View style={s.card}>
                {/* 1. Translation Preferences */}
                <Pressable
                  onPress={() => showInfo('Translation Preferences', 'Configure auto-detection, preferred speed, and voice dialects.')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Translate" size={20} color={teal} />
                    <View>
                      <Text style={s.settingsTitle}>Translation Preferences</Text>
                      <Text style={s.settingsSub}>Default languages, auto-detect</Text>
                    </View>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                {/* 2. AI Processing */}
                <Pressable
                  onPress={() => showInfo('AI Processing', 'Context-aware neural translation engine with real-time grammar refinement.')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Chip" size={20} color={teal} />
                    <View>
                      <Text style={s.settingsTitle}>AI Processing</Text>
                      <Text style={s.settingsSub}>Automatic (recommended)</Text>
                    </View>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                {/* 3. Offline Languages */}
                <Pressable
                  onPress={() => showInfo('Offline Languages', '3 languages downloaded: English, Japanese, Spanish (42 MB).')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Download" size={20} color={teal} />
                    <View>
                      <Text style={s.settingsTitle}>Offline Languages</Text>
                      <Text style={s.settingsSub}>3 languages downloaded</Text>
                    </View>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                {/* 4. Notifications */}
                <View style={s.settingsRow}>
                  <View style={s.settingsLeft}>
                    <Icon name="Bell" size={20} color={teal} />
                    <Text style={s.settingsTitle}>Notifications</Text>
                  </View>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: '#cde4e0', true: '#008e85' }}
                    thumbColor="#ffffff"
                  />
                </View>

                <View style={s.cardDivider} />

                {/* 5. Appearance */}
                <Pressable
                  onPress={() => showInfo('Appearance', 'Theme is set to match system default.')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Moon" size={20} color={teal} />
                    <Text style={s.settingsTitle}>Appearance</Text>
                  </View>
                  <View style={s.cardRowRight}>
                    <Text style={s.settingsValText}>System</Text>
                    <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                  </View>
                </Pressable>

                <View style={s.cardDivider} />

                {/* 6. Privacy & Data */}
                <Pressable
                  onPress={() => showInfo('Privacy & Data', 'Zero logs stored on remote servers. All translations happen on-device.')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Shield" size={20} color={teal} />
                    <Text style={s.settingsTitle}>Privacy & Data</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                {/* 7. Help & Support */}
                <Pressable
                  onPress={() => showInfo('Help & Support', 'Reach out anytime at support@bubbletranslator.app')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Help" size={20} color={teal} />
                    <Text style={s.settingsTitle}>Help & Support</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                </Pressable>

                <View style={s.cardDivider} />

                {/* 8. About Bubble */}
                <Pressable
                  onPress={() => showInfo('About Bubble', 'Bubble Translator v1.0.0 (Build 412). Your intelligent companion worldwide.')}
                  style={({ pressed }) => [s.settingsRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={s.settingsLeft}>
                    <Icon name="Info" size={20} color={teal} />
                    <Text style={s.settingsTitle}>About Bubble</Text>
                  </View>
                  <View style={s.cardRowRight}>
                    <Text style={s.settingsValText}>v1.0.0</Text>
                    <Icon name="ChevronRight" size={16} color="#8aa2a7" />
                  </View>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Modal Picker for Native, Target, or Country */}
        <Modal
          visible={pickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { width: w, maxHeight: '72%', paddingBottom: Math.max(22, inset.bottom) }]}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>
                  {pickerType === 'native'
                    ? 'Select Native Language'
                    : pickerType === 'target'
                    ? 'Select Translation Language'
                    : 'Select Home Country'}
                </Text>
                <Pressable onPress={() => setPickerVisible(false)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView>
                {(pickerType === 'country' ? POPULAR_COUNTRIES : POPULAR_LANGUAGES).map(item => {
                  const isSelected =
                    pickerType === 'country'
                      ? (screen === 'edit' ? editCountry.code : userProfile.country.code) === item.code
                      : pickerType === 'native'
                      ? (screen === 'edit' ? editNative.code : userProfile.language.code) === item.code
                      : (screen === 'edit' ? editTarget.code : userProfile.targetLanguage.code) === item.code;

                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        if (pickerType === 'country') {
                          if (screen === 'edit') setEditCountry(item);
                          else {
                            const updated = { ...userProfile, country: item };
                            setUserProfile(updated);
                            if (onUpdateProfile) onUpdateProfile(updated);
                          }
                        } else if (pickerType === 'native') {
                          if (screen === 'edit') setEditNative(item);
                          else {
                            const updated = { ...userProfile, language: item };
                            setUserProfile(updated);
                            if (onUpdateProfile) onUpdateProfile(updated);
                          }
                        } else {
                          if (screen === 'edit') setEditTarget(item);
                          else {
                            const updated = { ...userProfile, targetLanguage: item };
                            setUserProfile(updated);
                            if (onUpdateProfile) onUpdateProfile(updated);
                          }
                        }
                        setPickerVisible(false);
                      }}
                      style={s.pickerItem}
                    >
                      <Text style={s.pickerItemText}>
                        {item.flag}   {item.name} {item.native ? `(${item.native})` : ''}
                      </Text>
                      {isSelected && <Icon name="Check" size={18} color={teal} />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Avatar Options Modal */}
        <Modal
          visible={avatarModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAvatarModalVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={[s.modalSheet, { width: w, paddingBottom: Math.max(26, inset.bottom) }]}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Profile Photo</Text>
                <Pressable onPress={() => setAvatarModalVisible(false)} style={s.modalCloseBtn}>
                  <Text style={s.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Upload Photo"
                onPress={pickAvatarImage}
                style={({ pressed }) => [s.avatarActionBtn, pressed && { opacity: 0.7 }]}
              >
                <View style={s.avatarActionIconWrap}>
                  <Icon name="Camera" size={20} color={teal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.avatarActionTitle}>Upload Photo</Text>
                  <Text style={s.avatarActionSub}>Choose from gallery or device files</Text>
                </View>
                <Icon name="ChevronRight" size={16} color="#8aa2a7" />
              </Pressable>

              <View style={s.cardDivider} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Use Default Avatar"
                onPress={resetToDefaultAvatar}
                style={({ pressed }) => [s.avatarActionBtn, pressed && { opacity: 0.7 }]}
              >
                <View style={s.avatarActionIconWrap}>
                  <Icon name="User" size={20} color={teal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.avatarActionTitle}>Use Default Avatar</Text>
                  <Text style={s.avatarActionSub}>Revert to clean stylish Bubble avatar</Text>
                </View>
                <Icon name="ChevronRight" size={16} color="#8aa2a7" />
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Web Info Dialog Fallback */}
        {Boolean(dialogInfo) && (
          <Modal transparent visible animationType="fade" onRequestClose={() => setDialogInfo(null)}>
            <View style={s.modalOverlay}>
              <View style={[s.dialogCard, { width: Math.min(w * 0.86, 340) }]}>
                <Text style={s.dialogTitle}>{dialogInfo.title}</Text>
                <Text style={s.dialogMessage}>{dialogInfo.message}</Text>
                <Pressable onPress={() => setDialogInfo(null)} style={s.dialogOkBtn}>
                  <Text style={s.dialogOkText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#d9eeee' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBarTitle: { fontWeight: '800', color: ink, letterSpacing: -0.5 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  contentScroll: { paddingHorizontal: 16, paddingBottom: 30, gap: 14 },

  // Hero Illustration with centered overlapping avatar
  heroContainer: { position: 'relative', alignItems: 'center', marginBottom: 8 },
  fujiBg: { width: '100%', borderRadius: 24 },
  avatarCenterWrap: {
    position: 'absolute',
    bottom: -46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    position: 'relative',
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    shadowColor: '#0a3d38',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007b71',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    shadowColor: '#004a44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007b71',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },

  userInfoWrap: { alignItems: 'center', marginTop: 42, marginBottom: 8, gap: 4 },
  userName: { fontWeight: '800', color: ink, letterSpacing: -0.6 },
  userEmail: { color: muted, fontWeight: '500' },

  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e1f2ef',
    shadowColor: '#0a3d38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  cardRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardRowLabel: { fontSize: 14.5, fontWeight: '600', color: ink },
  cardRowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardRowValue: { fontSize: 14, fontWeight: '500', color: '#45676d' },
  cardDivider: { height: 1, backgroundColor: '#eff7f5' },

  // Form Styles (Screen 2)
  formGroup: { gap: 6, marginVertical: 4 },
  formLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 2 },
  formLabel: { fontSize: 13.5, fontWeight: '700', color: ink },
  formInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d2ebe5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14.5,
    fontWeight: '600',
    color: ink,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d2ebe5',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  formDropdownText: { fontSize: 14.5, fontWeight: '600', color: ink },
  saveBtn: {
    backgroundColor: '#006d64',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
    shadowColor: '#006d64',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 15 },

  // Settings Rows (Screen 3)
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingsTitle: { fontSize: 14, fontWeight: '700', color: ink },
  settingsSub: { fontSize: 11.5, fontWeight: '500', color: muted, marginTop: 1 },
  settingsValText: { fontSize: 13.5, fontWeight: '500', color: '#55767c' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10,35,38,0.42)', alignItems: 'center', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: ink },
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

  dialogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    gap: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  dialogTitle: { fontSize: 17, fontWeight: '800', color: ink, textAlign: 'center' },
  dialogMessage: { fontSize: 13.5, color: muted, textAlign: 'center', lineHeight: 20 },
  dialogOkBtn: { backgroundColor: teal, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 16, marginTop: 4 },
  dialogOkText: { color: 'white', fontWeight: '700', fontSize: 13.5 },

  // Avatar Actions
  avatarActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  avatarActionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e6f7f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ink,
  },
  avatarActionSub: {
    fontSize: 12,
    fontWeight: '500',
    color: muted,
    marginTop: 2,
  },
});
