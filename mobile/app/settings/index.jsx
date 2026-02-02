import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import styles from "@/assets/styles/settings.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function PrivacyAndSecurityScreen() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [share, setShare] = useState(false);
  const insets = useSafeAreaInsets();


  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Security</Text>

        <Card icon="lock-closed-outline" title="Change Password" />

        <ToggleCard
          icon="shield-checkmark-outline"
          title="Two-Factor Authentication"
          value={twoFactor}
          onChange={setTwoFactor}
        />

        <ToggleCard
          icon="finger-print-outline"
          title="Biometric Login"
          value={biometric}
          onChange={setBiometric}
        />

        <Text style={styles.section}>Privacy</Text>

        <ToggleCard
          icon="notifications-outline"
          title="Push Notifications"
          value={push}
          onChange={setPush}
        />

        <ToggleCard
          icon="mail-outline"
          title="Email Notifications"
          value={email}
          onChange={setEmail}
        />

        <ToggleCard
          icon="megaphone-outline"
          title="Marketing Emails"
          value={marketing}
          onChange={setMarketing}
        />

        <ToggleCard
          icon="analytics-outline"
          title="Share Usage Data"
          value={share}
          onChange={setShare}
        />

        <Text style={styles.section}>Account</Text>

        <Card icon="time-outline" title="Account Activity" />
        <Card icon="phone-portrait-outline" title="Connected Devices" />
        <Card icon="download-outline" title="Download Your Data" />
      </ScrollView>
    </View>
  );
}

function Card({ icon, title }) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.row}>
        <Ionicons name={icon} size={22} color="#ff7a00" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );
}

function ToggleCard({ icon, title, value, onChange }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name={icon} size={22} color="#ff7a00" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#ddd", true: "#ff7a00" }}
        thumbColor="#fff"
      />
    </View>
  );
}
