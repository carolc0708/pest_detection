from keras.models import Sequential
from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
from keras.layers import Dropout, Flatten, Dense
import os


# dimensions of our images.
img_width, img_height = 150, 150
curdir_path = os.path.dirname(os.path.realpath(__file__))

# load VGG16 neuronal network model from keras.applications
# model = VGG16(weights='imagenet', include_top=False)
model = VGG16(weights=None, include_top=False)
# load VGG16 pre-train weights
model.load_weights(curdir_path + '/vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5')

# set photo need to predict
img_path = curdir_path + '/copy.jpg'
img = image.load_img(img_path, target_size=(227, 227))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)

# use VGG16 model to extract features
features = model.predict(x)

# set classifier network model
bottleneck_model = Sequential()
bottleneck_model.add(Flatten(input_shape=features.shape[1:]))
bottleneck_model.add(Dense(256, activation='relu'))
bottleneck_model.add(Dropout(0.5))
bottleneck_model.add(Dense(5, activation='softmax'))
bottleneck_model.load_weights(curdir_path + '/fc_model.h5')

# execute classification
preds = bottleneck_model.predict_classes(features, verbose=0)
print(str(preds[0]))