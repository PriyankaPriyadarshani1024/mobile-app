
import { Text, View ,ScrollView,Image} from 'react-native';
import {Redirect,router} from 'expo-router'

import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../constants'
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from "../context/GlobalProvider";

export default function App (){ 
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href='../(tabs)/home'/>;
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FBDFDBFF' }}>
        <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}>
        <View className="w-full flex justify-center items-center min-h-[95vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />
           <View className="relative mt-5">
            <Text className="text-xl text-pink-900 font-mono text-center">
            SafeConnect keeps you safe{"\n"}
            always connected.{" "}{"\n"}
            </Text>
            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push('/sign-in')}
              containerStyles="w-full mt-7"
              
            />
          </View>
          </View>
      </ScrollView>
      <StatusBar backgroundColor="#FBDFDBFF" style="#4F2730" />
    </SafeAreaView>
  );
}
