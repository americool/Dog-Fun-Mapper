class User < ApplicationRecord
  has_many :locations
  has_many :comments


  def self.from_token_payload(payload)
    self.find payload["sub"]
  end

  before_save { self.email = email.downcase if email.present? }

  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
 # #3
   validates :name, length: { minimum: 1, maximum: 50 }, presence: true, uniqueness: {case_sensitive: true }
 # #4
  validates :password, presence: true, length: { minimum: 6 }, unless: :password_digest
  validates :password, length: { minimum: 6 }, allow_blank: true
 # #5
   validates :email,
             presence: true,
             uniqueness: { case_sensitive: false },
             length: { minimum: 3, maximum: 254 },
             format: {with: EMAIL_REGEX}

 # #6
   has_secure_password
end
