import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '@/utils/Constants'
import CustomText from './CustomText'

const CustomButton:FC<CustomButtonProps> = ({title,disabled,loading,onPress}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} activeOpacity={0.8} style={
        [styles.container,{backgroundColor : disabled ? Colors.secondary : Colors.primary}]
    }>
        {
          loading ? (
            <ActivityIndicator size='small' color={Colors.text} />
          ) : (
            <CustomText fontFamily='SemiBold' variant='h6'
             style={{color : disabled ? '#888' : '#fff'}} >
                {title}
            </CustomText>
          )
        }
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 10,
        paddingVertical : 15,
        borderRadius : 106,
        width : '95%',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 16,
        shadowColor : '#000',
        shadowOffset : {height: 1,width : 1},
        shadowOpacity : 0.2,
         elevation : 0.6
    }
})