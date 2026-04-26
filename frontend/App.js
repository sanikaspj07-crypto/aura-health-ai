import React, { useState, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- THEME COLORS ---
const COLORS = {
  background: '#FCF8F5', // Soft off-white
  primary: '#E6E6FA',    // Lavender
  secondary: '#FFE4E1',  // Rose
  accent: '#A58BCA',     // Deep lavender for buttons/icons
  text: '#4A4A4A',       // Calm dark gray
  textLight: '#8C8C8C',  // Soft gray for subtitles
  white: '#FFFFFF',
  shadow: '#D1C8C1',
  success: '#A8D5BA',
  warning: '#E8C56A',
  danger: '#E28E73'
};

export default function App() {
  const [appState, setAppState] = useState('onboarding'); // onboarding, login, main
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [cycles, setCycles] = useState([28, 29, 30]); // Initial mock data
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi beautiful! I'm your Aura assistant. How are you feeling today?", isUser: false }
  ]);

  // --- LOGIC ---
  const averageCycle = cycles.length > 0 
    ? Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length)
    : 28;

  const pcodRisk = averageCycle > 35 ? 'High' : averageCycle >= 30 ? 'Medium' : 'Low';

  // --- RENDERERS ---
  if (appState === 'onboarding') return <OnboardingScreen onComplete={() => setAppState('login')} />;
  if (appState === 'login') return <LoginScreen onLogin={() => setAppState('main')} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.mainContainer}>
         {currentTab === 'Dashboard' && <Dashboard averageCycle={averageCycle} pcodRisk={pcodRisk} />}
         {currentTab === 'AddCycle' && <AddCycle cycles={cycles} setCycles={setCycles} setTab={setCurrentTab} />}
         {currentTab === 'Insights' && <Insights cycles={cycles} averageCycle={averageCycle} pcodRisk={pcodRisk} />}
         {currentTab === 'Chat' && <Chatbot messages={messages} setMessages={setMessages} />}
      </View>
      <BottomTab currentTab={currentTab} setTab={setCurrentTab} />
    </SafeAreaView>
  );
}

// --- SCREENS ---

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const slides = [
    { title: "Welcome to Aura", desc: "Your calm, empathetic space for women's health.", icon: "leaf-outline" },
    { title: "Track & Predict", desc: "Understand your body with intelligent cycle prediction.", icon: "calendar-outline" },
    { title: "Support & Insights", desc: "Detect risks early and chat with our empathetic AI.", icon: "heart-half-outline" }
  ];

  return (
    <SafeAreaView style={styles.container}>
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24}}>
          <View style={styles.iconCircle}>
             <Ionicons name={slides[step].icon} size={80} color={COLORS.accent} />
          </View>
          <Text style={styles.title}>{slides[step].title}</Text>
          <Text style={styles.subtitle}>{slides[step].desc}</Text>
       </View>
       <View style={{padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24}}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => {
              if (step < slides.length - 1) setStep(step + 1);
              else onComplete();
            }}
          >
            <Text style={styles.primaryButtonText}>
              {step < slides.length - 1 ? "Next" : "Get Started"}
            </Text>
          </TouchableOpacity>
       </View>
    </SafeAreaView>
  );
}

const LoginScreen = ({ onLogin }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, padding: 24, justifyContent: 'center'}}>
        <Text style={[styles.title, {textAlign: 'left', marginBottom: 8}]}>Welcome Back</Text>
        <Text style={[styles.subtitle, {textAlign: 'left', marginBottom: 40}]}>Log in to continue your journey.</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={{marginRight: 12}} />
          <TextInput placeholder="Email" style={styles.input} placeholderTextColor={COLORS.textLight} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={{marginRight: 12}} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} placeholderTextColor={COLORS.textLight} />
        </View>

        <TouchableOpacity style={[styles.primaryButton, {marginTop: 20}]} onPress={onLogin}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 30}}>
          <View style={{flex: 1, height: 1, backgroundColor: COLORS.shadow, opacity: 0.5}} />
          <Text style={{marginHorizontal: 10, color: COLORS.textLight}}>OR</Text>
          <View style={{flex: 1, height: 1, backgroundColor: COLORS.shadow, opacity: 0.5}} />
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
          <Ionicons name="logo-google" size={20} color={COLORS.text} style={{marginRight: 10}} />
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Dashboard = ({ averageCycle, pcodRisk }) => {
  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Your Aura</Text>
      
      <View style={styles.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Ionicons name="water-outline" size={24} color={COLORS.accent} />
          <Text style={styles.cardTitle}>Next Period Prediction</Text>
        </View>
        <Text style={styles.predictionText}>In {averageCycle - 3} to {averageCycle + 3} days</Text>
        <Text style={styles.cardSubtitle}>Based on your {averageCycle} day average cycle.</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={[styles.card, {flex: 1, marginRight: 8, padding: 20}]}>
           <Text style={styles.cardTitle}>PCOD Risk</Text>
           <Text style={[styles.riskText, 
             {color: pcodRisk === 'High' ? COLORS.danger : pcodRisk === 'Medium' ? COLORS.warning : COLORS.success}
           ]}>{pcodRisk}</Text>
        </View>
        <View style={[styles.card, {flex: 1, marginLeft: 8, padding: 20}]}>
           <Text style={styles.cardTitle}>Health Score</Text>
           <Text style={[styles.riskText, {color: COLORS.accent}]}>85%</Text>
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: COLORS.secondary, marginTop: 8}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <Ionicons name="sparkles-outline" size={20} color={COLORS.text} />
           <Text style={[styles.cardTitle, {color: COLORS.text}]}>Daily Insight</Text>
        </View>
        <Text style={[styles.cardSubtitle, {color: COLORS.text, marginTop: 12}]}>
          Your body temperature might rise slightly today. Remember to stay hydrated and take deep breaths. You're doing great.
        </Text>
      </View>
    </ScrollView>
  );
}

const AddCycle = ({ cycles, setCycles, setTab }) => {
  const [days, setDays] = useState('');

  const handleAdd = () => {
    if (days && !isNaN(days)) {
      setCycles([...cycles, parseInt(days)]);
      setDays('');
      setTab('Dashboard');
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.headerTitle}>Log Cycle</Text>
      <View style={styles.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
          <Ionicons name="calendar-outline" size={24} color={COLORS.accent} />
          <Text style={styles.cardTitle}>Last Cycle Length</Text>
        </View>
        <Text style={styles.cardSubtitle}>How many days was your last cycle?</Text>
        <TextInput 
          style={[styles.input, styles.largeInput]}
          keyboardType="numeric"
          placeholder="e.g. 28"
          placeholderTextColor={COLORS.textLight}
          value={days}
          onChangeText={setDays}
          maxLength={3}
        />
        <TouchableOpacity style={[styles.primaryButton, {marginTop: 30}]} onPress={handleAdd}>
          <Text style={styles.primaryButtonText}>Save Cycle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Insights = ({ cycles, averageCycle, pcodRisk }) => {
  const trend = cycles.length >= 2 
    ? cycles[cycles.length - 1] > cycles[cycles.length - 2] ? 'Increasing' 
    : cycles[cycles.length - 1] < cycles[cycles.length - 2] ? 'Decreasing' : 'Stable'
    : 'Need more data';

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={{paddingBottom: 120}}>
      <Text style={styles.headerTitle}>Insights</Text>
      
      <View style={styles.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Ionicons name="bar-chart-outline" size={24} color={COLORS.accent} />
          <Text style={styles.cardTitle}>Cycle History</Text>
        </View>
        <Text style={styles.statText}>{cycles.length} Cycles Tracked</Text>
        <Text style={styles.cardSubtitle}>Your current trend is <Text style={{fontWeight: '600', color: COLORS.text}}>{trend}</Text>.</Text>
        <Text style={styles.cardSubtitle}>Average length: {averageCycle} days.</Text>
      </View>

      <View style={[styles.card, {backgroundColor: COLORS.primary}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Ionicons name="medical-outline" size={24} color={COLORS.text} />
          <Text style={[styles.cardTitle, {color: COLORS.text}]}>PCOD Risk Analysis</Text>
        </View>
        <Text style={[styles.riskText, {color: COLORS.text, marginVertical: 8}]}>{pcodRisk} Risk</Text>
        <Text style={[styles.cardSubtitle, {color: COLORS.text}]}>
          {pcodRisk === 'High' ? "Your cycles are consistently longer than 35 days. We recommend consulting a healthcare provider for professional advice." 
          : pcodRisk === 'Medium' ? "Your cycles are somewhat long. Keep tracking closely to see if a pattern emerges." 
          : "Your cycle length is within a typical, healthy range. Keep up the good habits!"}
        </Text>
      </View>
    </ScrollView>
  );
}

const Chatbot = ({ messages, setMessages }) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const userMsg = { id: Date.now(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      let aiText = "I'm here for you. Take a deep breath. How can I support you further?";
      const lower = inputText.toLowerCase();
      if (lower.includes('pcod') || lower.includes('pcos')) {
        aiText = "PCOD can feel overwhelming, but you're not alone. Regular tracking, a balanced lifestyle, and reducing stress can help manage it. Please consult a doctor for a proper diagnosis and tailored advice.";
      } else if (lower.includes('period') || lower.includes('pain') || lower.includes('cramps')) {
        aiText = "Period pain is difficult. A warm compress, some ginger tea, and gentle stretches might help. Be gentle with yourself today.";
      } else if (lower.includes('sad') || lower.includes('anxious') || lower.includes('stress')) {
        aiText = "Your feelings are completely valid. Hormonal shifts can heavily affect our mood. Make sure to prioritize self-care and rest today.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, isUser: false }]);
    }, 1200);
  };

  return (
    <View style={styles.chatContainer}>
      <Text style={[styles.headerTitle, {paddingHorizontal: 24, paddingTop: 20}]}>Aura AI</Text>
      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
        style={{flex: 1, paddingHorizontal: 20}}
        contentContainerStyle={{paddingBottom: 20}}
      >
        {messages.map(m => (
          <View key={m.id} style={[styles.messageBubble, m.isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, m.isUser ? styles.userMsgText : styles.aiMsgText]}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.chatInput}
            placeholder="Share how you're feeling..."
            placeholderTextColor={COLORS.textLight}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const BottomTab = ({ currentTab, setTab }) => {
  const tabs = [
    { name: 'Dashboard', icon: 'home' },
    { name: 'AddCycle', icon: 'add-circle' },
    { name: 'Insights', icon: 'bar-chart' },
    { name: 'Chat', icon: 'chatbubbles' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity key={tab.name} style={styles.tabItem} onPress={() => setTab(tab.name)}>
            <Ionicons 
              name={isActive ? tab.icon : `${tab.icon}-outline`} 
              size={26} 
              color={isActive ? COLORS.accent : COLORS.textLight} 
            />
            <Text style={[styles.tabText, {color: isActive ? COLORS.accent : COLORS.textLight}]}>
              {tab.name === 'AddCycle' ? 'Add' : tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    height: 64,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  largeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  predictionText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.accent,
    marginVertical: 12,
    letterSpacing: -1,
  },
  riskText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  statText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 15,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 90, // Space for bottom tab
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMsgText: {
    color: COLORS.white,
  },
  aiMsgText: {
    color: COLORS.text,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginRight: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: COLORS.accent,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
});