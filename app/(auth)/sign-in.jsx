import { View, Text, ScrollView,Image,Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import {router} from 'expo-router'
import { useGlobalContext } from "../../context/GlobalProvider";


const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  
  const [form,setForm] = useState({
    email:"",
    password:""
  })

  

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      Alert.alert("Success","User signed in successFully")
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
            Log in to SafeConnect
          </Text>
          <FormField
            title="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email"
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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-pink-900 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-pink-900 underline"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn