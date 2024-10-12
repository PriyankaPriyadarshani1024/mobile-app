import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: isLoading ? '#4F2730' : '#4F2730', // Change this color to whatever you like
          borderRadius: 20,
          minHeight: 62,
          width: 343,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isLoading ? 0.5 : 1,  // Apply opacity if loading
        },
        containerStyles
      ]}
      disabled={isLoading}
    >
        <Text style={[
        {
          color: '#F6EDEBFF', // Text color
          fontWeight: '600',
          fontSize: 18,
          textAlign: 'center',
        },
        textStyles
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
} 

export default CustomButton