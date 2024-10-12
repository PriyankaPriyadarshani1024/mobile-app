import { View, Text, ScrollView,Image ,Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import { createuser } from '../../lib/appwrite'
import {router} from'expo-router'
import { useGlobalContext } from "../../context/GlobalProvider";


const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form,setForm] = useState({
    username:"",
    email:"",
    password:""
  })
  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      const result = await createuser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      router.replace('../(tabs)/home')
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  }
  const [isSubmitting, setSubmitting] = useState(false)
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FBDFDBFF' }}>
      <ScrollView>
        <View className="w-full flex justify-center min-h-[90vh] px-4 my-6">
        <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />
          <Text className="text-2xl font-semibold  text-pink-900 mt-10 font-psemibold">
            Sign in to SafeConnect
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            keyboardType="UserName"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="Email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <Text></Text>
          <Text></Text>
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-pink-900 font-pregular">
              Have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-pink-900 underline"
            >
              SignIn
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp