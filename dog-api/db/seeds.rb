# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

20.times do
  Location.create(
    title: Faker::Hipster.sentence(3),
    category: ['Offleash Dog Area','Natural-Park','Pet-Store','Groomer','Dog-Friendly Business','Dog-Friendly-Water'].sample,
    address: Faker::Address.street_address,
    lat: Faker::Address.latitude,
    lng:Faker::Address.longitude,
    verified: Faker::Boolean.boolean
  )
end

locations = Location.all

200.times do
  Comment.create(
    location: locations.sample,
    body: Faker::Hipster.paragraph
  )
end

puts "Done: #{Location.count} locations and #{Comment.count} comments."
