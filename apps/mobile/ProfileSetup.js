import React, { useRef, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as Paint, Path, Rect, Stop } from 'react-native-svg';

export const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
];

export const POPULAR_COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
];

/* Clean SVG Icon Badges matching the reference UI */
function UserIcon({ size = 18, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path
        d="M4.5 20.2C5.6 16.6 8.5 14.5 12 14.5C15.5 14.5 18.4 16.6 19.5 20.2"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CalendarIcon({ size = 18, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="4.5" width="17" height="16" rx="3.5" stroke={color} strokeWidth="2.2" />
      <Path d="M3.5 9.5H20.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M8 2.5V5.5M16 2.5V5.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="8" cy="14" r="1.2" fill={color} />
      <Circle cx="12" cy="14" r="1.2" fill={color} />
      <Circle cx="16" cy="14" r="1.2" fill={color} />
    </Svg>
  );
}

function SpeechIcon({ size = 18, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5C20 15.6 16.4 19 12 19C10.5 19 9.1 18.6 7.8 17.8L4 19L5.2 15.5C4.4 14.3 4 12.9 4 11.5C4 7.4 7.6 4 12 4C16.4 4 20 7.4 20 11.5Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LocationIcon({ size = 18, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.5C12 21.5 18.5 15.6 18.5 10C18.5 6.4 15.6 3.5 12 3.5C8.4 3.5 5.5 6.4 5.5 10C5.5 15.6 12 21.5 12 21.5Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="2.5" fill={color} />
    </Svg>
  );
}

function PencilBadgeIcon({ size = 11, color = '#3a6664' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PremiumAvatar({ initials, size = 86 }) {
  return (
    <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={['#ffffff', '#e8f7f5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.avatarGradientInside}
      >
        {initials ? (
          <Text style={[styles.avatarMonogramText, { fontSize: size * 0.38 }]}>
            {initials}
          </Text>
        ) : (
          <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
            <Defs>
              <Paint id="premTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0" stopColor="#1cbfaa" />
                <Stop offset="1" stopColor="#007971" />
              </Paint>
            </Defs>
            <Circle cx="12" cy="7.5" r="4.3" fill="url(#premTeal)" />
            <Path
              d="M4.5 19.8C5.6 15.8 8.5 13.5 12 13.5C15.5 13.5 18.4 15.8 19.5 19.8C17.3 21 14.8 21.6 12 21.6C9.2 21.6 6.7 21 4.5 19.8Z"
              fill="url(#premTeal)"
            />
          </Svg>
        )}
      </LinearGradient>
    </View>
  );
}

export default function ProfileSetup({ onComplete, onSkip, onBack }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState(POPULAR_LANGUAGES[0]);
  const [country, setCountry] = useState(POPULAR_COUNTRIES[0]);

  const [pickerModal, setPickerModal] = useState(null); // 'language' | 'country' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const ageRef = useRef(null);

  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const w = Platform.OS === 'web' ? Math.min(width, 430) : width;

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const displayName = fullName || 'Traveler';
  const initials = ((firstName.trim()[0] || '') + (lastName.trim()[0] || '')).toUpperCase() || null;

  const handleSave = () => {
    const profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: displayName,
      age: age.trim(),
      language,
      country,
    };
    onComplete(profile);
  };

  const filteredLanguages = POPULAR_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCountries = POPULAR_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ContainerWrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <ContainerWrapper
      {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      style={styles.keyboardContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={{ width: w }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: inset.bottom + 28 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ================= TOP GRADIENT BANNER ================= */}
        <LinearGradient
          colors={['#017a72', '#009d93', '#25c9bc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerBanner, { paddingTop: Math.max(inset.top + 8, 20) }]}
        >
          {/* Top Bar Navigation */}
          <View style={styles.topNavRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onBack}
              hitSlop={14}
              style={styles.navBackBtn}
            >
              <Text style={styles.navBackIcon}>‹</Text>
            </Pressable>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STEP 2 OF 2</Text>
            </View>
            {/* Empty view to balance layout and avoid collision with Expo dev menu gear */}
            <View style={{ width: 34 }} />
          </View>

          {/* Profile Avatar */}
          <View style={styles.avatarSection}>
            <PremiumAvatar initials={initials} size={86} />

            {/* User Name with Pencil Edit Badge */}
            <Pressable
              onPress={() => firstNameRef.current?.focus()}
              style={styles.nameHeaderRow}
            >
              <Text style={styles.nameHeaderText} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={styles.pencilBadge}>
                <PencilBadgeIcon size={11} color="#007971" />
              </View>
            </Pressable>
          </View>
        </LinearGradient>

        {/* ================= WHITE FLOATING OVERLAPPING FORM CARD ================= */}
        <View style={styles.cardContainer}>
          {/* Subtle Floating Handle Indicator */}
          <View style={styles.floatingHandle} />

          <Text style={styles.cardHeaderTitle}>USER PROFILE</Text>

          {/* Field: First Name */}
          <View style={styles.fieldBlock}>
            <Pressable onPress={() => firstNameRef.current?.focus()}>
              <Text style={styles.fieldLabel}>First Name</Text>
            </Pressable>
            <Pressable
              onPress={() => firstNameRef.current?.focus()}
              style={[
                styles.pillInputContainer,
                focusedField === 'first' && styles.pillInputFocused,
              ]}
            >
              <LinearGradient colors={['#2cd4c6', '#009e93']} style={styles.iconCircleBadge}>
                <UserIcon size={17} color="#ffffff" />
              </LinearGradient>
              <TextInput
                ref={firstNameRef}
                placeholder="Enter First Name"
                placeholderTextColor="#88a8a6"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocusedField('first')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                style={styles.pillTextInput}
                autoCapitalize="words"
              />
            </Pressable>
          </View>

          {/* Field: Last Name */}
          <View style={styles.fieldBlock}>
            <Pressable onPress={() => lastNameRef.current?.focus()}>
              <Text style={styles.fieldLabel}>Last Name</Text>
            </Pressable>
            <Pressable
              onPress={() => lastNameRef.current?.focus()}
              style={[
                styles.pillInputContainer,
                focusedField === 'last' && styles.pillInputFocused,
              ]}
            >
              <LinearGradient colors={['#2cd4c6', '#009e93']} style={styles.iconCircleBadge}>
                <UserIcon size={17} color="#ffffff" />
              </LinearGradient>
              <TextInput
                ref={lastNameRef}
                placeholder="Enter Last Name"
                placeholderTextColor="#88a8a6"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedField('last')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                onSubmitEditing={() => ageRef.current?.focus()}
                style={styles.pillTextInput}
                autoCapitalize="words"
              />
            </Pressable>
          </View>

          {/* Field: Age */}
          <View style={styles.fieldBlock}>
            <Pressable onPress={() => ageRef.current?.focus()}>
              <Text style={styles.fieldLabel}>Age</Text>
            </Pressable>
            <Pressable
              onPress={() => ageRef.current?.focus()}
              style={[
                styles.pillInputContainer,
                focusedField === 'age' && styles.pillInputFocused,
              ]}
            >
              <LinearGradient colors={['#2cd4c6', '#009e93']} style={styles.iconCircleBadge}>
                <CalendarIcon size={17} color="#ffffff" />
              </LinearGradient>
              <TextInput
                ref={ageRef}
                placeholder="Enter Age (e.g. 25)"
                placeholderTextColor="#88a8a6"
                value={age}
                onChangeText={(v) => setAge(v.replace(/[^0-9]/g, '').slice(0, 3))}
                onFocus={() => setFocusedField('age')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                keyboardType="number-pad"
                style={styles.pillTextInput}
              />
            </Pressable>
          </View>

          {/* Field: I Speak (Primary Language) - Required */}
          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>I Speak (Primary Language)</Text>
              <Text style={styles.requiredTag}>* Required</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSearchQuery('');
                setPickerModal('language');
              }}
              style={({ pressed }) => [
                styles.pillInputContainer,
                pressed && styles.pillInputPressed,
              ]}
            >
              <LinearGradient colors={['#2cd4c6', '#009e93']} style={styles.iconCircleBadge}>
                <SpeechIcon size={17} color="#ffffff" />
              </LinearGradient>
              <View style={styles.pillSelectTextWrap}>
                <Text style={styles.pillSelectValue}>
                  {language.flag} {language.name}
                </Text>
                <Text style={styles.pillSelectSub}>{language.native}</Text>
              </View>
              <Text style={styles.pillChevron}>›</Text>
            </Pressable>
          </View>

          {/* Field: Your Country - Optional */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Your Country</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSearchQuery('');
                setPickerModal('country');
              }}
              style={({ pressed }) => [
                styles.pillInputContainer,
                pressed && styles.pillInputPressed,
              ]}
            >
              <LinearGradient colors={['#2cd4c6', '#009e93']} style={styles.iconCircleBadge}>
                <LocationIcon size={17} color="#ffffff" />
              </LinearGradient>
              <View style={styles.pillSelectTextWrap}>
                <Text style={styles.pillSelectValue}>
                  {country ? `${country.flag} ${country.name}` : 'Select Country'}
                </Text>
              </View>
              <Text style={styles.pillChevron}>›</Text>
            </Pressable>
          </View>

          {/* Save Button */}
          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, marginTop: 12 }]}
          >
            <LinearGradient
              colors={['#20bdae', '#00978b', '#00726a']}
              style={styles.savePillButton}
            >
              <Text style={styles.savePillButtonText}>SAVE</Text>
            </LinearGradient>
          </Pressable>

          {/* Skip for now text */}
          <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipLinkWrap}>
            <Text style={styles.skipLinkText}>Skip for now</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ================= BOTTOM SHEET PICKER MODAL ================= */}
      <Modal
        visible={pickerModal !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.backdropDismiss} onPress={() => setPickerModal(null)} />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>
                {pickerModal === 'language' ? 'Select Primary Language' : 'Select Your Country'}
              </Text>
              <Pressable
                onPress={() => setPickerModal(null)}
                hitSlop={12}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </Pressable>
            </View>

            {/* Search Input */}
            <TextInput
              placeholder={
                pickerModal === 'language'
                  ? 'Search language (e.g. Japanese, Hindi)...'
                  : 'Search country (e.g. India, Japan)...'
              }
              placeholderTextColor="#85a6a4"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.sheetSearchInput}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />

            {/* List */}
            <ScrollView style={styles.sheetList} showsVerticalScrollIndicator={false}>
              {pickerModal === 'language' &&
                filteredLanguages.map((item) => {
                  const isSelected = language.code === item.code;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        setLanguage(item);
                        setPickerModal(null);
                      }}
                      style={[styles.sheetItemRow, isSelected && styles.sheetItemActive]}
                    >
                      <Text style={styles.sheetItemFlag}>{item.flag}</Text>
                      <View style={styles.flex1}>
                        <Text style={[styles.sheetItemTitle, isSelected && styles.sheetItemTitleActive]}>
                          {item.name}
                        </Text>
                        <Text style={styles.sheetItemSub}>{item.native}</Text>
                      </View>
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </Pressable>
                  );
                })}

              {pickerModal === 'country' &&
                filteredCountries.map((item) => {
                  const isSelected = country?.code === item.code;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        setCountry(item);
                        setPickerModal(null);
                      }}
                      style={[styles.sheetItemRow, isSelected && styles.sheetItemActive]}
                    >
                      <Text style={styles.sheetItemFlag}>{item.flag}</Text>
                      <Text style={[styles.sheetItemTitle, styles.flex1, isSelected && styles.sheetItemTitleActive]}>
                        {item.name}
                      </Text>
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ContainerWrapper>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#eff7f6',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBackIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: -2,
  },
  stepBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e4fdfb',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderWidth: 3.5,
    borderColor: '#ffffff',
    shadowColor: '#002624',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 8,
  },
  avatarGradientInside: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMonogramText: {
    fontWeight: '800',
    color: '#00746c',
    letterSpacing: -0.5,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  nameHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.2,
    maxWidth: 240,
  },
  pencilBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 36,
    marginHorizontal: 16,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    marginTop: -30,
    marginBottom: 20,
    shadowColor: '#003a35',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#e2f4f2',
    gap: 15,
  },
  floatingHandle: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#d8ecea',
    alignSelf: 'center',
    marginBottom: 6,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0a2729',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  fieldBlock: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a4143',
    paddingLeft: 4,
  },
  requiredTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00978b',
    paddingRight: 4,
  },
  pillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fcfb',
    borderWidth: 1.2,
    borderColor: '#dbeefc',
    borderRadius: 30,
    paddingHorizontal: 7,
    paddingVertical: 5,
    height: 52,
    gap: 10,
  },
  pillInputFocused: {
    borderColor: '#009d93',
    backgroundColor: '#ffffff',
    shadowColor: '#009d93',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  pillInputPressed: {
    backgroundColor: '#f0f9f8',
    borderColor: '#009d93',
  },
  iconCircleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#071d1f',
    fontWeight: '500',
    paddingVertical: 0,
    paddingRight: 14,
  },
  pillSelectTextWrap: {
    flex: 1,
  },
  pillSelectValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#071d1f',
  },
  pillSelectSub: {
    fontSize: 11,
    color: '#557f7d',
    marginTop: 1,
  },
  pillChevron: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00978b',
    paddingRight: 14,
  },
  savePillButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#008b80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  savePillButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.4,
  },
  skipLinkWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#597e7d',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 26, 28, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '78%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 10,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cfe6e4',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#071f21',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eef7f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 13,
    fontWeight: '800',
    color: '#496f6e',
  },
  sheetSearchInput: {
    backgroundColor: '#f1f8f7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#071f21',
    borderWidth: 1,
    borderColor: '#cce5e3',
    marginBottom: 10,
  },
  sheetList: {
    maxHeight: 320,
  },
  sheetItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f8f7',
    gap: 12,
    borderRadius: 12,
  },
  sheetItemActive: {
    backgroundColor: '#eaf6f4',
  },
  sheetItemFlag: {
    fontSize: 22,
  },
  sheetItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#071f21',
  },
  sheetItemTitleActive: {
    color: '#00857a',
  },
  sheetItemSub: {
    fontSize: 12,
    color: '#557f7d',
    marginTop: 1,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '800',
    color: '#009c91',
  },
  flex1: {
    flex: 1,
  },
});
