import { View, Text ,Image} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import {Tabs,Redirect} from 'expo-router'
import {icons} from '../../constants';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Assuming you're using React Navigation

const TabIcon =(icon,color,name,focused) => {
  return(
    <View className="flex items-center justify-center gap-2">
      <Image 
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }} >
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
      screenOptions={{
        tabBarShowLabel:true
      }}
      >
      <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen 
          name="gadians"
          options={{
            headerShown:false
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#FBDFDBFF" style="#4F2730" />
    </>
     
  )
}


export default TabsLayout                                                          